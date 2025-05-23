import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { prisma } from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import logger from "@/lib/logger";

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

      logger.debug(
        `Bookmark mutation started: userId=${userId}, answerId=${answerId}, type=${type}`,
      );

      try {
        // Cek apakah jawaban ada
        const answer = await prisma.answer.findUnique({
          where: {
            answerId,
          },
          select: {
            answerId: true,
          },
        });

        if (!answer) {
          logger.warn(
            `Answer not found for bookmarking: answerId=${answerId}, userId=${userId}`,
          );
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
              logger.warn(
                `Bookmark already exists: userId=${userId}, answerId=${answerId}`,
              );
              throw new TRPCError({
                code: "CONFLICT",
                message: "Jawaban sudah ada di bookmark",
              });
            }

            const created = await prisma.savedAnswer.create({
              data: {
                userId,
                answerId,
              },
            });

            logger.info(
              `Bookmark added: userId=${userId}, answerId=${answerId}`,
            );
            return created;

          case "remove":
            if (!existingBookmark) {
              logger.warn(
                `Bookmark not found for removal: userId=${userId}, answerId=${answerId}`,
              );
              throw new TRPCError({
                code: "NOT_FOUND",
                message: "Jawaban tidak ditemukan di bookmark",
              });
            }

            const deleted = await prisma.savedAnswer.delete({
              where: {
                userId_answerId: {
                  userId,
                  answerId,
                },
              },
            });

            logger.info(
              `Bookmark removed: userId=${userId}, answerId=${answerId}`,
            );
            return deleted;
        }
      } catch (error) {
        logger.error(
          `Error in bookmark mutation: ${
            error instanceof Error ? error.message : String(error)
          } | userId=${userId}, answerId=${answerId}, type=${type}`,
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Terjadi kesalahan pada bookmark",
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

      logger.debug(
        `Fetching bookmarks: userId=${userId}, cursor=${JSON.stringify(
          cursor,
        )}, limit=${limit}`,
      );

      try {
        const bookmarks = await prisma.savedAnswer.findMany({
          where: {
            userId,
            ...(cursor ? { bookmarkId: { lt: cursor.bookmarkId } } : {}),
          },
          take: limit + 1,
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
            isBookmarked: userId ? true : false,
          },
        }));

        const hasMore = formattedBookmarks.length > limit;
        const items = hasMore
          ? formattedBookmarks.slice(0, limit)
          : formattedBookmarks;
        const nextCursor = hasMore
          ? { bookmarkId: items[items.length - 1].answer.bookmarkId }
          : null;

        logger.info(`Fetched ${items.length} bookmarks for userId=${userId}`);

        return {
          items,
          nextCursor,
        };
      } catch (error) {
        logger.error(
          `Error fetching bookmarks: ${
            error instanceof Error ? error.message : String(error)
          } | userId=${userId}`,
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Gagal mengambil bookmark",
        });
      }
    }),
});
