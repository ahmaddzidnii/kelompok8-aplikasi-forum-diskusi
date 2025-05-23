import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { TRPCError } from "@trpc/server";
import logger from "@/lib/logger";

import { createTRPCRouter, publicProcedure } from "@/trpc/init";

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

  getCountNavbar: publicProcedure.query(async () => {
    logger.info("Fetching navbar counts");
    try {
      // Replace with actual DB queries if needed
      const questionCount = 77;
      const answerCount = 53;
      logger.debug(
        `Navbar counts - Questions: ${questionCount}, Answers: ${answerCount}`,
      );
      return {
        questionCount,
        answerCount,
      };
    } catch (error) {
      logger.error(`Error fetching navbar counts: ${(error as Error).message}`);
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
});
