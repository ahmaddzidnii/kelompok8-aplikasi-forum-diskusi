import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { prisma } from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const votesRouter = createTRPCRouter({
  upVote: protectedProcedure
    .input(
      z.object({
        answerId: z.string(),
        type: z.enum(["upVote", "cancelVote"]).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { answerId, type } = input;
      const userId = ctx.session?.user.id;

      switch (type) {
        case "upVote":
          // Check if the user has already voted
          const existingVote = await prisma.upvoteAnswer.findFirst({
            where: {
              userId: userId,
              answerId: answerId,
            },
            select: {
              answerId: true,
            },
          });

          if (existingVote) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "User has already voted for this answer",
            });
          }

          // Create a new vote
          const vote = await prisma.upvoteAnswer.create({
            data: {
              userId: userId as string,
              answerId: answerId,
            },
            select: {
              answerId: true,
            },
          });

          const answerCount = await prisma.answer.findUnique({
            where: {
              answerId: vote.answerId,
            },
            select: {
              _count: {
                select: {
                  upvotesAnswer: true,
                },
              },
            },
          });

          return {
            message: "Vote added successfully",
            type: type,
            answerId: vote.answerId,
            questionSlug: vote,
            count: answerCount?._count.upvotesAnswer,
          };

        case "cancelVote":
          // Check if the user has already voted
          const existingVoteToCancel = await prisma.upvoteAnswer.findFirst({
            where: {
              userId: userId,
              answerId: answerId,
            },
            select: {
              answerId: true,
              upvoteId: true,
            },
          });

          if (!existingVoteToCancel) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "User has not voted for this answer",
            });
          }

          // Delete the vote
          const deletedVote = await prisma.upvoteAnswer.delete({
            where: {
              userId_answerId_upvoteId: {
                userId: userId as string,
                answerId: answerId,
                upvoteId: existingVoteToCancel.upvoteId,
              },
            },
            select: {
              answerId: true,
            },
          });

          const answer = await prisma.answer.findUnique({
            where: {
              answerId: deletedVote.answerId,
            },
            select: {
              _count: {
                select: {
                  upvotesAnswer: true,
                },
              },
            },
          });

          return {
            message: "Vote cancelled successfully",
            type: type,
            answerId: answerId,
            count: answer?._count.upvotesAnswer,
          };
        default:
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid vote type",
          });
      }
    }),
});
