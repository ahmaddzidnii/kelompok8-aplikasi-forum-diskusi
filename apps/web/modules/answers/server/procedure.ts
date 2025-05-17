import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { prisma } from "@/lib/prisma";
import {
  createTRPCRouter,
  dynamicProcedure,
  protectedProcedure,
} from "@/trpc/init";

import { answerSchema } from "../schema";

export const answersRouter = createTRPCRouter({
  createAnswer: protectedProcedure
    .input(answerSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { questionId, content } = input;
        const session = ctx.session;

        // 1. Cek keberadaan pertanyaan
        const question = await prisma.questions.findUnique({
          where: { questionId },
          select: { userId: true, slug: true },
        });
        if (!question) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Pertanyaan tidak ditemukan",
          });
        }

        // 2. Cek user tidak menjawab sendiri
        if (question.userId === session?.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Anda tidak bisa menjawab pertanyaan sendiri",
          });
        }

        // 3. Buat jawaban
        const answer = await prisma.answers.create({
          data: {
            userId: session?.user.id!,
            questionId,
            content,
          },
        });

        return {
          answerId: answer.answerId,
          questionSlug: question.slug,
        };
      } catch (error) {
        // A. Duplicate key — user sudah pernah menjawab
        if (
          error instanceof PrismaClientKnownRequestError &&
          (error.meta?.target as string[]).includes("userId_questionId")
        ) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Anda sudah menjawab pertanyaan ini sebelumnya",
          });
        }

        // B. TRPCError yang sudah kita lempar di atas biarkan lewat
        if (error instanceof TRPCError) {
          throw error;
        }

        // C. Error tak terduga → INTERNAL_SERVER_ERROR
        console.error("Unexpected error creating answer:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Gagal membuat jawaban, silakan coba lagi nanti",
        });
      }
    }),
  getMany: dynamicProcedure
    .input(
      z.object({
        questionSlug: z.string(),
        cursor: z
          .object({
            answerId: z.string(),
            createdAt: z.string().optional(), // String format for date
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

      // Mengubah createdAt string ke Date object jika ada
      const parsedCursor = cursor
        ? {
            ...cursor,
            createdAt: cursor.createdAt
              ? new Date(cursor.createdAt)
              : undefined,
          }
        : null;

      const q = await prisma.questions.findUnique({
        where: {
          slug: questionSlug,
        },
        select: {
          questionId: true,
        },
      });

      if (!q) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Pertanyaan tidak ditemukan",
        });
      }

      // Define base where clause
      let where: any = {
        questionId: q.questionId,
      };

      // Pendekatan alternatif untuk pagination yang lebih sederhana:
      // Gunakan skip dan take tanpa kondisi WHERE yang kompleks untuk mode recommended
      if (sort === "recommended") {
        // Untuk sort recommended, kita gunakan strategi yang berbeda
        // Ambil semua jawaban, urutkan server-side, lalu paginate
        const allAnswers = await prisma.answers.findMany({
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
            upvotesAnswer: true, // Ambil semua upvotes
          },
        });

        // Sort berdasarkan jumlah upvotes (desc) dan createdAt (desc)
        const sortedAnswers = allAnswers.sort((a, b) => {
          // Primary sort by upvote count
          if (b._count.upvotesAnswer !== a._count.upvotesAnswer) {
            return b._count.upvotesAnswer - a._count.upvotesAnswer;
          }

          // Secondary sort by createdAt
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });

        // Handle pagination
        let startIndex = 0;
        if (parsedCursor) {
          // Find the index of the cursor item
          const cursorIndex = sortedAnswers.findIndex(
            (answer) => answer.answerId === parsedCursor.answerId,
          );
          if (cursorIndex !== -1) {
            startIndex = cursorIndex + 1;
          }
        }

        // Slice untuk pagination
        const paginatedAnswers = sortedAnswers.slice(
          startIndex,
          startIndex + limit + 1,
        );

        // Format answers
        const formattedAnswers = paginatedAnswers.map((answer) => {
          const { savedAnswers, upvotesAnswer, ...answerWithoutBookmarks } =
            answer;
          return {
            ...answerWithoutBookmarks,
            isBookmarked: savedAnswers.length > 0,
          };
        });

        const hasMore = formattedAnswers.length > limit;
        const items = hasMore
          ? formattedAnswers.slice(0, limit)
          : formattedAnswers;

        // Set next cursor
        let nextCursor = null;
        if (hasMore && items.length > 0) {
          const lastItem = items[items.length - 1];
          nextCursor = {
            answerId: lastItem.answerId,
            createdAt: lastItem.createdAt.toISOString(),
            upvoteCount: lastItem._count.upvotesAnswer,
          };
        }

        return {
          items,
          nextCursor,
        };
      } else {
        // Untuk sort asc/desc, gunakan pendekatan standard dengan cursor
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

        const answers = await prisma.answers.findMany({
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
            savedAnswers: {
              where: {
                userId: session?.user.id,
              },
              take: 1,
            },
          },
        });

        // Format answers
        const formattedAnswers = answers.map((answer) => {
          const { savedAnswers, ...answerWithoutBookmarks } = answer;
          return {
            ...answerWithoutBookmarks,
            isBookmarked: savedAnswers.length > 0,
          };
        });

        const hasMore = formattedAnswers.length > limit;
        const items = hasMore
          ? formattedAnswers.slice(0, -1)
          : formattedAnswers;

        // Set next cursor
        let nextCursor = null;
        if (hasMore && items.length > 0) {
          const lastItem = items[items.length - 1];
          nextCursor = {
            answerId: lastItem.answerId,
            createdAt: lastItem.createdAt.toISOString(), // Convert to ISO string
            upvoteCount: lastItem._count.upvotesAnswer,
          };
        }

        return {
          items,
          nextCursor,
        };
      }
    }),
});
