import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { config } from "@/config";
import logger from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { dynamicProcedure } from "@/trpc/init";

export const getMany = dynamicProcedure
  .input(
    z.object({
      questionSlug: z.string(),
      cursor: z
        .object({
          answerId: z.string(),
          createdAt: z.string().optional(),
          upvoteCount: z.number().optional(),
        })
        .nullish(),
      limit: z.number().min(1).max(100),
      sort: z.preprocess(
        (val) =>
          ["asc", "desc", "recommended"].includes(val as string)
            ? val
            : undefined,
        z.enum(["asc", "desc", "recommended"]).default("recommended"),
      ),
    }),
  )
  .query(async ({ input, ctx }) => {
    const { cursor, limit, questionSlug, sort } = input;
    const session = ctx.session;

    logger.debug(
      `Fetching answers: questionSlug=${questionSlug}, cursor=${JSON.stringify(
        cursor,
      )}, limit=${limit}, sort=${sort}`,
    );

    try {
      // Mengubah createdAt string ke Date object jika ada
      const parsedCursor = cursor
        ? {
            ...cursor,
            createdAt: cursor.createdAt
              ? new Date(cursor.createdAt)
              : undefined,
          }
        : null;

      const q = await prisma.question.findUnique({
        where: {
          slug: questionSlug,
        },
        select: {
          questionId: true,
        },
      });

      if (!q) {
        logger.warn(`Question not found: slug=${questionSlug}`);
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Pertanyaan tidak ditemukan",
        });
      }

      let where: any = {
        questionId: q.questionId,
      };

      if (sort === "recommended") {
        const allAnswers = await prisma.answer.findMany({
          where: {
            questionId: q.questionId,
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
            _count: {
              select: {
                upvotesAnswer: true,
                comments: true,
              },
            },
            savedAnswers: {
              where: {
                userId: session?.user.id,
              },
              take: 1,
            },
            upvotesAnswer: {
              take: config.votes.limitUserShow,
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true,
                  },
                },
              },
            },
          },
        });

        let userVotedAnswerIds: string[] = [];
        if (session?.user.id) {
          const userVotes = await prisma.upvoteAnswer.findMany({
            where: {
              userId: session.user.id,
              answerId: {
                in: allAnswers.map((answer) => answer.answerId),
              },
            },
            select: {
              answerId: true,
            },
          });
          userVotedAnswerIds = userVotes.map((vote) => vote.answerId);
        }

        const sortedAnswers = allAnswers.sort((a, b) => {
          if (b._count.upvotesAnswer !== a._count.upvotesAnswer) {
            return b._count.upvotesAnswer - a._count.upvotesAnswer;
          }
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });

        let startIndex = 0;
        if (parsedCursor) {
          const cursorIndex = sortedAnswers.findIndex(
            (answer) => answer.answerId === parsedCursor.answerId,
          );
          if (cursorIndex !== -1) {
            startIndex = cursorIndex + 1;
          }
        }

        const paginatedAnswers = sortedAnswers.slice(
          startIndex,
          startIndex + limit + 1,
        );

        const formattedAnswers = paginatedAnswers.map((answer) => {
          const { savedAnswers, upvotesAnswer, ...answerWithoutBookmarks } =
            answer;
          return {
            ...answerWithoutBookmarks,
            isBookmarked: session ? savedAnswers.length > 0 : false,
            isAlreadyUpvoted: userVotedAnswerIds.includes(answer.answerId),
            usersVoteUp: upvotesAnswer.map((upvote) => ({
              id: upvote.user.id,
              name: upvote.user.name || "User",
              username: upvote.user.username || "user",
              image: upvote.user.image || "/avatar.png",
            })),
          };
        });

        const hasMore = formattedAnswers.length > limit;
        const items = hasMore
          ? formattedAnswers.slice(0, limit)
          : formattedAnswers;

        let nextCursor = null;
        if (hasMore && items.length > 0) {
          const lastItem = items[items.length - 1];
          nextCursor = {
            answerId: lastItem.answerId,
            createdAt: lastItem.createdAt.toISOString(),
            upvoteCount: lastItem._count.upvotesAnswer,
          };
        }

        logger.info(
          `Fetched ${items.length} recommended answers for questionSlug=${questionSlug}`,
        );

        return {
          items,
          nextCursor,
        };
      } else {
        if (parsedCursor) {
          if (sort === "asc") {
            where = {
              ...where,
              OR: [
                { createdAt: { gt: parsedCursor.createdAt } },
                {
                  createdAt: parsedCursor.createdAt,
                  answerId: { gt: parsedCursor.answerId },
                },
              ],
            };
          } else if (sort === "desc") {
            where = {
              ...where,
              OR: [
                { createdAt: { lt: parsedCursor.createdAt } },
                {
                  createdAt: parsedCursor.createdAt,
                  answerId: { lt: parsedCursor.answerId },
                },
              ],
            };
          }
        }

        const answers = await prisma.answer.findMany({
          where,
          take: limit + 1,
          orderBy: {
            createdAt: sort,
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
            _count: {
              select: {
                upvotesAnswer: true,
                comments: true,
              },
            },
            upvotesAnswer: {
              take: config.votes.limitUserShow,
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true,
                  },
                },
              },
            },
            savedAnswers: {
              where: {
                userId: session?.user.id,
              },
              take: 1,
            },
          },
        });

        const userVotedAnswerIds: string[] = [];

        if (session?.user.id) {
          const userVotes = await prisma.upvoteAnswer.findMany({
            where: {
              userId: session.user.id,
              answerId: {
                in: answers.map((answer) => answer.answerId),
              },
            },
            select: {
              answerId: true,
            },
          });
          userVotedAnswerIds.push(...userVotes.map((vote) => vote.answerId));
        }

        const formattedAnswers = answers.map((answer) => {
          const { savedAnswers, ...answerWithoutBookmarks } = answer;
          return {
            ...answerWithoutBookmarks,
            isBookmarked: savedAnswers.length > 0,
            isAlreadyUpvoted: userVotedAnswerIds.includes(answer.answerId),
            usersVoteUp: answer.upvotesAnswer.map((upvote) => ({
              id: upvote.user.id,
              name: upvote.user.name || "User",
              username: upvote.user.username || "user",
              image: upvote.user.image || "/avatar.png",
            })),
          };
        });

        const hasMore = formattedAnswers.length > limit;
        const items = hasMore
          ? formattedAnswers.slice(0, -1)
          : formattedAnswers;

        let nextCursor = null;
        if (hasMore && items.length > 0) {
          const lastItem = items[items.length - 1];
          nextCursor = {
            answerId: lastItem.answerId,
            createdAt: lastItem.createdAt.toISOString(),
            upvoteCount: lastItem._count.upvotesAnswer,
          };
        }

        logger.info(
          `Fetched ${items.length} answers for questionSlug=${questionSlug} with sort=${sort}`,
        );

        return {
          items,
          nextCursor,
        };
      }
    } catch (error) {
      logger.error(
        `Error fetching answers: ${
          error instanceof Error ? error.message : String(error)
        } | questionSlug=${questionSlug}`,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Gagal mengambil jawaban, silakan coba lagi nanti",
      });
    }
  });
