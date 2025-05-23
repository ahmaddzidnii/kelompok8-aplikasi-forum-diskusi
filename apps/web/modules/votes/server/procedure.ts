import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { prisma } from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import logger from "@/lib/logger";

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

      logger.info(
        `Vote mutation called by user: ${userId}, answerId: ${answerId}, type: ${type}`,
      );

      try {
        switch (type) {
          case "upVote":
            logger.debug(
              `Checking if user ${userId} already voted for answer ${answerId}`,
            );
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
              logger.warn(
                `User ${userId} has already voted for answer ${answerId}`,
              );
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: "User has already voted for this answer",
              });
            }

            logger.debug(
              `Creating new vote for user ${userId} on answer ${answerId}`,
            );
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

            logger.info(`Vote added for user ${userId} on answer ${answerId}`);
            logger.debug(
              `Current upvotes for answer ${answerId}: ${answerCount?._count.upvotesAnswer}`,
            );

            return {
              message: "Vote added successfully",
              type: type,
              answerId: vote.answerId,
              questionSlug: vote,
              count: answerCount?._count.upvotesAnswer,
            };

          case "cancelVote":
            logger.debug(
              `Checking if user ${userId} has a vote to cancel for answer ${answerId}`,
            );
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
              logger.warn(
                `User ${userId} has not voted for answer ${answerId}, cannot cancel`,
              );
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: "User has not voted for this answer",
              });
            }

            logger.debug(
              `Deleting vote for user ${userId} on answer ${answerId}`,
            );
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

            logger.info(
              `Vote cancelled for user ${userId} on answer ${answerId}`,
            );
            logger.debug(
              `Current upvotes for answer ${answerId}: ${answer?._count.upvotesAnswer}`,
            );

            return {
              message: "Vote cancelled successfully",
              type: type,
              answerId: answerId,
              count: answer?._count.upvotesAnswer,
            };
          default:
            logger.warn(`Invalid vote type received: ${type}`);
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Invalid vote type",
            });
        }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        logger.error(
          `Error processing vote for user ${userId} on answer ${answerId}: ${(error as Error).message}`,
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to process vote",
        });
      }
    }),
});
