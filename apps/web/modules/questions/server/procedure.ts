import { z } from "zod";
import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/trpc/init";

import { askFormSchema } from "@/modules/questions/schema";
import { generateQuestion } from "./services/generateQuestion";
import { prisma } from "@/lib/prisma";

export const questionsRouter = createTRPCRouter({
  createQuestion: protectedProcedure
    .input(askFormSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        await generateQuestion(input, ctx.session);
        return {
          message: "Ask created successfully",
        };
      } catch (error) {
        console.error("Error creating ask:", error);
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
      try {
        const questions = await prisma.questions.findMany({
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
          },
          cursor: cursor ? { questionId: cursor.questionId } : undefined,
        });

        const hasMore = questions.length > limit;
        // Remove the last item if there are more items
        const items = hasMore ? questions.slice(0, -1) : questions;

        // Set the next cursor to the last item if there are more items
        const lastItem = items[items.length - 1];

        const nextCursor = hasMore
          ? {
              questionId: lastItem.questionId,
              updatedAt: lastItem.updatedAt,
            }
          : null;

        return {
          items,
          nextCursor,
        };
      } catch (error) {
        console.error("Error fetching questions:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  getOne: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { slug } = input;

      const question = await prisma.questions.findUnique({
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
        },
      });

      if (!question) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Question not found",
        });
      }

      return question;
    }),
});
