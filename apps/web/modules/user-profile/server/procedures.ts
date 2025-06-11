import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { prisma } from "@/lib/prisma";
import logger from "@/lib/logger";

import { createTRPCRouter, publicProcedure } from "@/trpc/init";
import { config } from "@/config";

export const usersRouter = createTRPCRouter({
  getOneUser: publicProcedure
    .input(
      z.object({
        username: z.string(),
      }),
    )
    .query(async ({ input }) => {
      logger.info(`Fetching user with username: ${input.username}`);
      try {
        const user = await prisma.user.findUnique({
          where: {
            username: input.username,
          },
        });

        if (!user) {
          logger.warn(`User not found: ${input.username}`);
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        logger.info(`User found: ${input.username}`);
        return user;
      } catch (error) {
        logger.error(
          `Error fetching user ${input.username}: ${(error as Error).message}`,
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch user",
        });
      }
    }),

  getCountNavbar: publicProcedure
    .input(
      z.object({
        username: z.string(),
      }),
    )
    .query(async ({ input }) => {
      logger.info("Fetching navbar counts");
      try {
        const { username } = input;

        const getCountAnswerPromise = prisma.answer.count({
          where: {
            user: {
              username,
            },
          },
        });

        const getCountQuestionPromise = prisma.question.count({
          where: {
            user: {
              username,
            },
          },
        });

        const [questionCount, answerCount] = await Promise.all([
          getCountQuestionPromise,
          getCountAnswerPromise,
        ]);

        logger.debug(
          `Navbar counts - Questions: ${questionCount}, Answers: ${answerCount}`,
        );
        return {
          questionCount,
          answerCount,
        };
      } catch (error) {
        logger.error(
          `Error fetching navbar counts: ${(error as Error).message}`,
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch navbar counts",
        });
      }
    }),

  getTitleByUsername: publicProcedure
    .input(
      z.object({
        username: z.string(),
      }),
    )
    .query(async ({ input }) => {
      logger.info(`Fetching title for username: ${input.username}`);
      try {
        const user = await prisma.user.findUnique({
          where: {
            username: input.username,
          },
          select: {
            name: true,
            username: true,
          },
        });

        if (!user) {
          logger.warn(`User not found for title: ${input.username}`);
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        const title = `${user.name} (${user.username})`;
        logger.info(`Title generated for user: ${title}`);
        return {
          title,
        };
      } catch (error) {
        logger.error(
          `Error fetching title for user ${input.username}: ${(error as Error).message}`,
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch user title",
        });
      }
    }),

  getQuestionsByUsername: publicProcedure
    .input(
      z.object({
        username: z.string(),
        limit: z
          .number()
          .min(1)
          .max(100)
          .default(config.questions.defaultLimit),
        cursor: z
          .object({
            questionId: z.string(),
          })
          .optional(),
      }),
    )
    .query(async ({ input }) => {
      const { username, cursor, limit } = input;
      logger.info(`Fetching questions for user: ${username}`);

      try {
        const questions = await prisma.question.findMany({
          where: {
            questionId: cursor?.questionId
              ? {
                  gte: cursor.questionId,
                }
              : {},
            user: {
              username,
            },
          },
          take: limit + 1,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            _count: {
              select: {
                answers: true,
              },
            },
          },
        });

        const hasMore = questions.length > limit;
        const items = hasMore ? questions.slice(0, -1) : questions;

        let nextCursor = null;
        if (hasMore && items.length > 0) {
          const lastItem = items[items.length - 1];
          nextCursor = {
            questionId: lastItem.questionId,
          };
        }
        return {
          items,
          nextCursor,
          hasMore,
        };
      } catch (error) {
        logger.error(
          `Error fetching questions for user ${username}: ${(error as Error).message}`,
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch user questions",
        });
      }
    }),

  getAnswersByUsername: publicProcedure
    .input(
      z.object({
        username: z.string(),
        limit: z.number().min(1).max(100).default(config.answers.defaultLimit),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const { username, cursor, limit } = input;
      logger.info(`Fetching answers for user: ${username}, cursor: ${cursor}`);

      try {
        const answers = await prisma.answer.findMany({
          where: {
            user: {
              username,
            },
            ...(cursor && {
              answerId: {
                lt: cursor, // Use less than for descending order pagination
              },
            }),
          },
          take: limit + 1,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            question: {
              select: {
                questionId: true,
                content: true,
                slug: true,
              },
            },
            user: {
              select: {
                username: true,
                name: true,
                image: true,
              },
            },
          },
        });

        const hasMore = answers.length > limit;
        const items = hasMore ? answers.slice(0, -1) : answers;

        let nextCursor: string | undefined = undefined;
        if (hasMore && items.length > 0) {
          const lastItem = items[items.length - 1];
          nextCursor = lastItem.answerId;
        }

        logger.info(
          `Fetched ${items.length} answers for user: ${username}, hasMore: ${hasMore}`,
        );

        return {
          items,
          nextCursor,
          hasMore,
        };
      } catch (error) {
        logger.error(
          `Error fetching answers for user ${username}: ${(error as Error).message}`,
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch user answers",
        });
      }
    }),

  getDataOverview: publicProcedure
    .input(
      z.object({
        username: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { username } = input;
      logger.info(`Fetching data overview for user: ${username}`);

      try {
        const getRecentQuestionsPromise = prisma.question.findMany({
          where: {
            user: {
              username,
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 4,
        });

        const getRecentAnswersPromise = prisma.answer.findMany({
          where: {
            user: {
              username,
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 4,
          include: {
            question: {
              select: {
                questionId: true,
                content: true,
                slug: true,
              },
            },
          },
        });

        const [recentQuestions, recentAnswers] = await Promise.all([
          getRecentQuestionsPromise,
          getRecentAnswersPromise,
        ]);

        return {
          recentQuestions,
          recentAnswers,
        };
      } catch (error) {
        logger.error(
          `Error fetching data overview for user ${username}: ${(error as Error).message}`,
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch user data overview",
        });
      }
    }),
});
