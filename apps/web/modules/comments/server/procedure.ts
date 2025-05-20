import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { prisma } from "@/lib/prisma";
import {
  createTRPCRouter,
  dynamicProcedure,
  protectedProcedure,
  //   protectedProcedure,
} from "@/trpc/init";
import { config } from "@/config";

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
    .query(async ({ input }) => {
      const { answerId, cursor, limit, sort } = input;
      const comments = await prisma.comment.findMany({
        where: {
          answerId,
          parentCommentId: null,
          commentId: cursor?.commentId
            ? sort == "asc"
              ? {
                  gt: cursor.commentId,
                }
              : {
                  lt: cursor.commentId,
                }
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
        isEdited: comment.createdAt !== comment.updatedAt,
        isOwner: comment.user.id === comment.answer.user.id,
      }));

      return {
        items: formattedComments,
        nextCursor,
      };
    }),

  getRepliesByParentCommentId: dynamicProcedure
    .input(
      z.object({
        parentCommentId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { parentCommentId } = input;

      const replies = await prisma.comment.findMany({
        where: {
          parentCommentId,
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
          parentComment: {
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

      const formattedReplies = replies.map((reply) => ({
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
          username: reply.parentComment!.user.username,
        },
        isEdited: reply.createdAt !== reply.updatedAt,
        isOwner: reply.user.id === reply.answer.user.id,
      }));

      return formattedReplies;
    }),

  createTopLevelComment: protectedProcedure
    .input(
      z.object({
        answerId: z.string(),
        content: z.string().min(1).max(500),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const { answerId, content } = input;
        const userId = ctx.session?.user.id as string;

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
          isEdited: comment.createdAt !== comment.updatedAt,
          isOwner: comment.user.id === comment.answer.user.id,
        };

        return filteredComment;
      } catch (error) {
        console.error("Error creating top-level comment:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create comment",
        });
      }
    }),
});
