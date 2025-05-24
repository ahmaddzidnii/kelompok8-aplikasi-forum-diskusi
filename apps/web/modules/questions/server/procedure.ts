import { z } from "zod";
import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  dynamicProcedure,
  protectedProcedure,
  publicProcedure,
} from "@/trpc/init";

import {
  askFormSchema,
  updateQuestionSchema,
} from "@/modules/questions/schema";
import { generateQuestion } from "./services/generateQuestion";
import { prisma } from "@/lib/prisma";

import { config } from "@/config";
import logger from "@/lib/logger";

export const questionsRouter = createTRPCRouter({
  createQuestion: protectedProcedure
    .input(askFormSchema)
    .mutation(async ({ input, ctx }) => {
      logger.info("Attempting to create a new question.");
      try {
        const questionSlug = await generateQuestion(input, ctx.session);
        logger.info(`Question created successfully with slug: ${questionSlug}`);
        return {
          message: "Ask created successfully",
          slug: questionSlug,
        };
      } catch (error) {
        logger.error(`Error creating ask: ${(error as Error).message}`);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create ask",
        });
      }
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            questionId: z.string(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit } = input;
      const { session } = ctx;
      logger.info(`Fetching questions for user: ${session?.user.id}`);
      try {
        logger.debug(
          `Query params - cursor: ${JSON.stringify(cursor)}, limit: ${limit}`,
        );
        const questions = await prisma.question.findMany({
          where: {
            userId: session?.user.id,
          },
          take: limit + 1,
          orderBy: {
            updatedAt: "desc",
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
                organization: true,
              },
            },
            questionCategories: {
              select: {
                category: {
                  select: {
                    categoryId: true,
                    name: true,
                  },
                },
              },
            },
          },
          cursor: cursor ? { questionId: cursor.questionId } : undefined,
        });

        logger.debug(`Fetched ${questions.length} questions from database.`);
        const hasMore = questions.length > limit;
        const items = hasMore ? questions.slice(0, -1) : questions;
        const lastItem = items[items.length - 1];

        const nextCursor = hasMore
          ? {
              questionId: lastItem.questionId,
              updatedAt: lastItem.updatedAt,
            }
          : null;

        logger.info(
          `Returning ${items.length} questions. Has more: ${hasMore}`,
        );
        return {
          items,
          nextCursor,
        };
      } catch (error) {
        logger.error(`Error fetching questions: ${(error as Error).message}`);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch questions",
        });
      }
    }),
  getOne: dynamicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { slug } = input;
      const { session } = ctx;
      logger.info(`Fetching question with slug: ${slug}`);

      try {
        const question = await prisma.question.findUnique({
          where: {
            slug,
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
                organization: true,
              },
            },
            questionCategories: {
              select: {
                category: {
                  select: {
                    categoryId: true,
                    name: true,
                  },
                },
              },
            },
          },
        });

        if (!question) {
          logger.warn(`Question not found for slug: ${slug}`);
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Question not found",
          });
        }

        const isAnswered = await prisma.answer.findFirst({
          where: {
            questionId: question?.questionId,
            userId: session?.user.id,
          },
          select: {
            answerId: true,
          },
        });

        const hasAnswered = !!isAnswered;
        logger.info(`Question found. Has answered: ${hasAnswered}`);

        return {
          ...question,
          hasAnswered,
        };
      } catch (error) {
        logger.error(
          `Error fetching question with slug ${slug}: ${(error as Error).message}`,
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch question",
        });
      }
    }),
  getRecommended: dynamicProcedure
    .input(
      z.object({
        categoryId: z.string().optional(),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const { categoryId, cursor } = input;
      logger.info(
        `Fetching recommended questions. Category: ${categoryId}, Cursor: ${cursor}`,
      );
      try {
        const questions = await prisma.question.findMany({
          where: {
            questionCategories: {
              some: {
                categoryId: categoryId,
              },
            },
          },

          take: config.questions.defaultLimit + 1,
          cursor: cursor ? { questionId: cursor } : undefined,
          orderBy: {
            updatedAt: "desc",
          },

          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
                organization: true,
              },
            },
            questionCategories: {
              select: {
                category: {
                  select: {
                    categoryId: true,
                    name: true,
                  },
                },
              },
            },
          },
        });

        logger.debug(`Fetched ${questions.length} recommended questions.`);
        return {
          items: questions,
          nextCursor:
            questions.length > config.questions.defaultLimit
              ? questions[questions.length - 1].questionId
              : null,
        };
      } catch (error) {
        logger.error(
          `Error fetching recommended questions: ${(error as Error).message}`,
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch recommended questions",
        });
      }
    }),
  getPageTitle: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { slug } = input;
      logger.info(`Fetching page title for slug: ${slug}`);
      try {
        const question = await prisma.question.findUnique({
          where: {
            slug,
          },
          select: {
            content: true,
          },
        });

        return `${question?.content} - ${config.appName}`;
      } catch (error) {
        logger.error(
          `Error fetching page title for slug ${slug}: ${(error as Error).message}`,
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch page title",
        });
      }
    }),
  edit: protectedProcedure
    .input(updateQuestionSchema)
    .mutation(async ({ input, ctx }) => {
      const { session } = ctx;
      const { slug, categories, questionContent } = input;
      logger.info(`Editing question with slug: ${slug}`);

      try {
        const question = await prisma.question.findUnique({
          where: {
            slug,
          },
        });

        if (!question) {
          logger.warn(`Question not found for slug: ${slug}`);
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Question not found",
          });
        }

        if (question.userId !== session?.user.id) {
          logger.warn(
            `User ${session?.user.id} does not have permission to edit this question`,
          );
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have permission to edit this question",
          });
        }

        const updatedQuestion = await prisma.question.update({
          where: {
            slug,
          },
          data: {
            content: questionContent,
            questionCategories: {
              deleteMany: {},
              create: categories.map((category) => ({
                categoryId: category.value,
              })),
            },
          },
        });

        logger.info(`Question with slug ${slug} updated successfully`);
        return {
          message: "Question updated successfully",
          question: updatedQuestion,
        };
      } catch (error) {
        logger.error(
          `Error editing question with slug ${slug}: ${(error as Error).message}`,
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to edit question",
        });
      }
    }),

  delete: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { slug } = input;
      const { session } = ctx;
      logger.info(`Deleting question with slug: ${slug}`);

      try {
        const question = await prisma.question.findUnique({
          where: {
            slug,
          },
        });

        if (!question) {
          logger.warn(`Question not found for slug: ${slug}`);
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Question not found",
          });
        }

        if (question.userId !== session?.user.id) {
          logger.warn(
            `User ${session?.user.id} does not have permission to delete this question`,
          );
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have permission to delete this question",
          });
        }

        await prisma.question.delete({
          where: {
            slug,
          },
        });

        logger.info(`Question with slug ${slug} deleted successfully`);
        return {
          message: "Question deleted successfully",
        };
      } catch (error) {
        logger.error(
          `Error deleting question with slug ${slug}: ${(error as Error).message}`,
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete question",
        });
      }
    }),
});
