import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import logger from "@/lib/logger";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { settingsProfileFormSchema } from "../ui/pages/Profile/schema";

export const settingsRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session) {
      logger.warn("Unauthorized access attempt to getProfile.");
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    try {
      logger.info(`Fetching profile for user: ${ctx.session.user.id}`);
      const user = await prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      });

      if (!user) {
        logger.warn(`User not found: ${ctx.session.user.id}`);
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      logger.info(`Profile fetched for user: ${ctx.session.user.id}`);
      return user;
    } catch (error) {
      logger.error(`Error fetching profile: ${(error as Error).message}`);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch profile",
      });
    }
  }),
  updateProfile: protectedProcedure
    .input(settingsProfileFormSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session) {
        logger.warn("Unauthorized access attempt to updateProfile.");
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }
      try {
        logger.info(`Updating profile for user: ${ctx.session.user.id}`);
        await prisma.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            name: input.name.trim(),
            location: input.location?.trim(),
            organization: input.organization?.trim(),
            bio: input.bio?.trim(),
          },
        });

        logger.info(`Profile updated for user: ${ctx.session.user.id}`);
        return { status: "OK" };
      } catch (error) {
        logger.error(
          `Error updating profile for user ${ctx.session.user.id}: ${(error as Error).message}`,
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update profile",
        });
      }
    }),
  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session) {
      logger.warn("Unauthorized access attempt to deleteAccount.");
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    try {
      logger.info(`Deleting account for user: ${ctx.session.user.id}`);
      await prisma.$transaction(async (tx) => {
        await tx.user.delete({
          where: {
            id: ctx.session?.user.id,
          },
        });
      });

      logger.info(`Account deleted for user: ${ctx.session.user.id}`);
      return { status: "OK" };
    } catch (error) {
      logger.error(
        `Error deleting account for user ${ctx.session.user.id}: ${(error as Error).message}`,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete account",
      });
    }
  }),
  changeUsername: protectedProcedure
    .input(z.object({ username: z.string().min(3).max(20) }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session) {
        logger.warn("Unauthorized access attempt to changeUsername.");
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      try {
        logger.info(
          `Changing username for user: ${ctx.session.user.id} to ${input.username}`,
        );
        // Check if username already exists
        const existingUser = await prisma.user.findUnique({
          where: {
            username: input.username,
          },
        });

        if (existingUser) {
          logger.warn(`Username conflict: ${input.username} already exists.`);
          throw new TRPCError({
            code: "CONFLICT",
            message: "Username already exists",
          });
        }

        await prisma.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            username: input.username,
          },
        });

        logger.info(`Username changed for user: ${ctx.session.user.id}`);
        return { status: "OK" };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        logger.error(
          `Error changing username for user ${ctx.session.user.id}: ${(error as Error).message}`,
        );
        // Handle other errors
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to change username",
        });
      }
    }),
});
