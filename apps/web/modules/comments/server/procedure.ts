import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { prisma } from "@/lib/prisma";
import {
  createTRPCRouter,
  dynamicProcedure,
  protectedProcedure,
  publicProcedure,
} from "@/trpc/init";
import { config } from "@/config";
import logger from "@/lib/logger";
import { getCommentPermissions, hasPermission } from "./utils";

export const commentsRoute = createTRPCRouter({
  getTopLevelCommentsByAnswerId: dynamicProcedure
    .input(
      z.object({
        answerId: z.string(),
        limit: z.number().min(1).max(100).default(config.comments.defaultLimit),
        cursor: z
          .object({
            commentId: z.string().nullish(),
          })
          .optional(),
        sort: z.enum(["asc", "desc"]).default("desc"),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { answerId, cursor, limit, sort } = input;
      logger.info(`Fetching top-level comments for answerId: ${answerId}`);
      try {
        logger.debug(
          `Params - limit: ${limit}, cursor: ${JSON.stringify(cursor)}, sort: ${sort}`,
        );
        const comments = await prisma.comment.findMany({
          where: {
            answerId,
            parentCommentId: null,
            commentId: cursor?.commentId
              ? sort == "asc"
                ? { gt: cursor.commentId }
                : { lt: cursor.commentId }
              : undefined,
          },
          orderBy: {
            commentId: sort ? sort : undefined,
          },
          take: limit + 1,
          include: {
            answer: {
              select: {
                user: {
                  select: {
                    id: true,
                  },
                },
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
            _count: {
              select: {
                childComments: true,
              },
            },
          },
        });

        if (!comments) {
          logger.warn(`No comments found for answerId: ${answerId}`);
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Comments not found",
          });
        }

        const hasMore = comments.length > limit;
        const items = hasMore ? comments.slice(0, -1) : comments;
        const lastItem = items[items.length - 1];
        const nextCursor = hasMore
          ? {
              commentId: lastItem.commentId,
            }
          : null;

        const formattedComments = items.map((comment) => ({
          commentId: comment.commentId,
          user: {
            id: comment.user.id,
            name: comment.user.name,
            username: comment.user.username,
            image: comment.user.image,
          },
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          countReplies: comment._count.childComments,
          isEdited: comment.isEdited,
          isOwner: comment.user.id === comment.answer.user.id,
          permissions: getCommentPermissions({
            commentUserId: comment.user.id,
            contentOwnerId: comment.answer.user.id,
            currentUserId: ctx.session?.user.id,
          }),
        }));

        logger.info(
          `Fetched ${items.length} top-level comments for answerId: ${answerId}`,
        );
        return {
          items: formattedComments,
          nextCursor,
        };
      } catch (error) {
        logger.error(
          `Error fetching top-level comments for answerId ${answerId}: ${error instanceof Error ? error.message : String(error)}`,
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch comments",
        });
      }
    }),

  getRepliesByParentCommentId: dynamicProcedure
    .input(
      z.object({
        parentCommentId: z.string(),
        cursor: z
          .object({
            commentId: z.string().nullish(),
          })
          .optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { parentCommentId, cursor } = input;
      const LIMIT = config.replies.defaultLimit;
      logger.info(`Fetching replies for parentCommentId: ${parentCommentId}`);
      try {
        logger.debug(
          `Params - limit: ${LIMIT}, cursor: ${JSON.stringify(cursor)}`,
        );
        const replies = await prisma.comment.findMany({
          where: {
            parentCommentId,
            commentId: cursor?.commentId ? { gt: cursor.commentId } : undefined,
          },
          take: LIMIT + 1,
          include: {
            answer: {
              select: {
                user: {
                  select: {
                    id: true,
                  },
                },
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
            replyToComment: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                  },
                },
              },
            },
          },
        });

        const hasMore = replies.length > LIMIT;
        const items = hasMore ? replies.slice(0, -1) : replies;
        const lastItem = items[items.length - 1];
        const nextCursor = hasMore
          ? {
              commentId: lastItem.commentId,
            }
          : null;

        const formattedReplies = items.map((reply) => ({
          commentId: reply.commentId,
          user: {
            id: reply.user.id,
            name: reply.user.name,
            username: reply.user.username,
            image: reply.user.image,
          },
          content: reply.content,
          createdAt: reply.createdAt,
          updatedAt: reply.updatedAt,
          replyingTo: {
            username: reply.replyToComment?.user.username,
          },
          isEdited: reply.isEdited,
          isOwner: reply.user.id === reply.answer.user.id,
          permissions: getCommentPermissions({
            commentUserId: reply.user.id,
            contentOwnerId: reply.answer.user.id,
            currentUserId: ctx.session?.user.id,
          }),
        }));

        logger.info(
          `Fetched ${items.length} replies for parentCommentId: ${parentCommentId}`,
        );
        return {
          items: formattedReplies,
          nextCursor,
        };
      } catch (error) {
        logger.error(
          `Error fetching replies for parentCommentId ${parentCommentId}: ${error instanceof Error ? error.message : String(error)}`,
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch replies",
        });
      }
    }),

  createTopLevelComment: protectedProcedure
    .input(
      z.object({
        answerId: z.string(),
        content: z.string().min(1).max(config.comments.maxLength),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const { answerId, content } = input;
        const userId = ctx.session?.user.id as string;

        logger.info(
          `Creating top-level comment for answerId: ${answerId} by userId: ${userId}`,
        );
        const comment = await prisma.comment.create({
          data: {
            content,
            answerId,
            userId,
          },
          include: {
            answer: {
              select: {
                user: {
                  select: {
                    id: true,
                  },
                },
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
            _count: {
              select: {
                childComments: true,
              },
            },
          },
        });

        const filteredComment = {
          commentId: comment.commentId,
          user: {
            id: comment.user.id,
            name: comment.user.name,
            username: comment.user.username,
            image: comment.user.image,
          },
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          countReplies: comment._count.childComments,
          isEdited: comment.isEdited,
          isOwner: comment.user.id === comment.answer.user.id,
          permissions: getCommentPermissions({
            commentUserId: comment.user.id,
            contentOwnerId: comment.answer.user.id,
            currentUserId: userId,
          }),
        };

        logger.info(
          `Top-level comment created: commentId=${comment.commentId}, answerId=${answerId}, userId=${userId}`,
        );
        return filteredComment;
      } catch (error) {
        logger.error(
          `Error creating top-level comment: ${error instanceof Error ? error.message : String(error)}`,
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create comment",
        });
      }
    }),

  createReply: protectedProcedure
    .input(
      z.object({
        answerId: z.string(),
        parentCommentId: z.string(),
        content: z.string().min(1).max(config.replies.maxLength),
        replyToCommentId: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { parentCommentId, content, answerId, replyToCommentId } = input;
      const userId = ctx.session?.user.id as string;

      logger.debug(
        `Attempting to create reply: parentCommentId=${parentCommentId}, answerId=${answerId}, userId=${userId}, replyToCommentId=${replyToCommentId}`,
      );

      try {
        const parentComment = await prisma.comment.findUnique({
          where: { commentId: parentCommentId },
        });

        if (!parentComment) {
          logger.warn(
            `Parent comment not found: parentCommentId=${parentCommentId}`,
          );
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Parent comment not found",
          });
        }

        const reply = await prisma.comment.create({
          data: {
            parentCommentId,
            content,
            userId,
            answerId,
            replyToCommentId,
          },
          include: {
            answer: {
              select: {
                user: {
                  select: {
                    id: true,
                  },
                },
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
            replyToComment: {
              select: {
                user: {
                  select: {
                    username: true,
                  },
                },
              },
            },
          },
        });

        logger.info(
          `Reply created successfully: replyId=${reply.commentId}, parentCommentId=${parentCommentId}, userId=${userId}`,
        );

        const formatedReply = {
          commentId: reply.commentId,
          user: {
            id: reply.user.id,
            name: reply.user.name,
            username: reply.user.username,
            image: reply.user.image,
          },
          content: reply.content,
          createdAt: reply.createdAt,
          updatedAt: reply.updatedAt,
          isEdited: reply.isEdited,
          isOwner: reply.user.id === reply.answer.user.id,
          replyingTo: {
            username: reply.replyToComment?.user.username,
          },
          replyToCommentId: reply.replyToCommentId,
        };

        return formatedReply;
      } catch (error) {
        logger.error(
          `Error creating reply: ${error instanceof Error ? error.message : String(error)} | parentCommentId=${parentCommentId}, answerId=${answerId}, userId=${userId}`,
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create reply",
        });
      }
    }),

  delete: protectedProcedure
    .input(
      z.object({
        commentId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { commentId } = input;
      const userId = ctx.session?.user.id as string;

      logger.info(`Deleting comment: commentId=${commentId}, userId=${userId}`);
      try {
        const comment = await prisma.comment.findUnique({
          where: { commentId },
          include: {
            answer: {
              select: {
                user: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        });

        if (!comment) {
          logger.warn(`Comment not found: commentId=${commentId}`);
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Comment not found",
          });
        }

        const permissions = await getCommentPermissions({
          commentUserId: comment.userId,
          contentOwnerId: comment.answer.user.id,
          currentUserId: userId,
        });

        const allwowedToDelete = hasPermission(permissions, "CAN_DELETE");

        if (!allwowedToDelete) {
          logger.warn(
            `User ${userId} does not have permission to delete comment: commentId=${commentId}`,
          );
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have permission to delete this comment",
          });
        }

        await prisma.comment.delete({
          where: { commentId },
        });

        logger.info(
          `Comment deleted successfully: commentId=${commentId}, userId=${userId}`,
        );
        return { success: true, message: "Comment deleted successfully" };
      } catch (error) {
        logger.error(
          `Error deleting comment: ${error instanceof Error ? error.message : String(error)} | commentId=${commentId}, userId=${userId}`,
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete comment",
        });
      }
    }),

  edit: protectedProcedure
    .input(
      z.object({
        commentId: z.string(),
        content: z.string().min(1).max(config.comments.maxLength),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { commentId, content } = input;
      const userId = ctx.session?.user.id as string;

      logger.info(`Editing comment: commentId=${commentId}, userId=${userId}`);

      try {
        const comment = await prisma.comment.findUnique({
          where: { commentId },
          include: {
            answer: {
              select: {
                user: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        });

        if (!comment) {
          logger.warn(`Comment not found: commentId=${commentId}`);
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Comment not found",
          });
        }

        const permissions = await getCommentPermissions({
          commentUserId: comment.userId,
          contentOwnerId: comment.answer.user.id,
          currentUserId: userId,
        });

        const allowedToEdit = hasPermission(permissions, "CAN_EDIT");

        if (!allowedToEdit) {
          logger.warn(
            `User ${userId} does not have permission to edit comment: commentId=${commentId}`,
          );
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have permission to edit this comment",
          });
        }

        const updatedComment = await prisma.comment.update({
          where: { commentId },
          data: {
            content,
            isEdited: true,
          },
          include: {
            answer: {
              select: {
                user: {
                  select: {
                    id: true,
                  },
                },
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
        });

        return updatedComment;
      } catch (error) {
        logger.error(
          `Error editing comment: ${error instanceof Error ? error.message : String(error)} | commentId=${commentId}, userId=${userId}`,
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to edit comment",
        });
      }
    }),
  getOne: publicProcedure
    .input(
      z.object({
        commentId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { commentId } = input;
      logger.info(`Fetching comment: commentId=${commentId}`);
      try {
        const comment = await prisma.comment.findUnique({
          where: { commentId },
          select: {
            content: true,
          },
        });

        if (!comment) {
          logger.warn(`Comment not found: commentId=${commentId}`);
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Comment not found",
          });
        }

        return comment;
      } catch (error) {
        logger.error(
          `Error fetching comment: ${error instanceof Error ? error.message : String(error)} | commentId=${commentId}`,
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch comment",
        });
      }
    }),
});
