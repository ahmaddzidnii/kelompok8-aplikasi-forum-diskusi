import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { prisma } from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const bookmarkRouter = createTRPCRouter({
  bookmark: protectedProcedure
    .input(
      z.object({
        answerId: z.string(),
        type: z.enum(["add", "remove"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { answerId, type } = input;
      const userId = ctx.session?.user.id!;

      // Cek apakah jawaban ada
      const answer = await prisma.answers.findUnique({
        where: {
          answerId,
        },
        select: {
          answerId: true,
        },
      });

      if (!answer) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Jawaban tidak ditemukan",
        });
      }

      // Cek apakah jawaban sudah ada di bookmark
      const existingBookmark = await prisma.savedAnswer.findUnique({
        where: {
          userId_answerId: {
            userId,
            answerId: answerId,
          },
        },
      });

      switch (type) {
        case "add":
          if (existingBookmark) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Jawaban sudah ada di bookmark",
            });
          }

          return await prisma.savedAnswer.create({
            data: {
              userId,
              answerId,
            },
          });

        case "remove":
          if (!existingBookmark) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Jawaban tidak ditemukan di bookmark",
            });
          }

          return await prisma.savedAnswer.delete({
            where: {
              userId_answerId: {
                userId,
                answerId,
              },
            },
          });
      }
    }),

  getBookmarks: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            bookmarkId: z.string(),
          })
          .nullish(),
        limit: z.number().min(1).max(100).default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id!;
      const { cursor, limit } = input;

      const bookmarks = await prisma.savedAnswer.findMany({
        where: {
          userId,
          ...(cursor
            ? { bookmarkId: { lt: cursor.bookmarkId } } // Using "lt" since ordering is "desc"
            : {}),
        },
        take: limit + 1, // Take one extra to check if there are more results
        select: {
          bookmarkId: true,
          answer: {
            select: {
              answerId: true,
              content: true,
              createdAt: true,
              question: {
                select: {
                  slug: true,
                  content: true,
                },
              },
              user: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  image: true,
                  organization: true,
                },
              },
            },
          },
        },
        orderBy: {
          bookmarkId: "desc",
        },
      });

      const formattedBookmarks = bookmarks.map((bookmark) => ({
        answer: {
          ...bookmark.answer,
          bookmarkId: bookmark.bookmarkId,
          isBookmarked: true,
        },
      }));

      const hasMore = formattedBookmarks.length > limit;
      const items = hasMore
        ? formattedBookmarks.slice(0, limit)
        : formattedBookmarks;
      const nextCursor = hasMore
        ? { bookmarkId: items[items.length - 1].answer.bookmarkId }
        : null;

      return {
        items,
        nextCursor,
      };
    }),
});
