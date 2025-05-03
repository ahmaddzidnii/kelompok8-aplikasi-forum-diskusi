import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { settingsProfileFormSchema } from "../ui/pages/Profile/schema";

export const settingsRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return user;
  }),
  updateProfile: protectedProcedure
    .input(settingsProfileFormSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }
      try {
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

        return { status: "OK" };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    try {
      await prisma.user.delete({
        where: {
          id: ctx.session.user.id,
        },
      });

      return { status: "OK" };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }),
  changeUsername: protectedProcedure
    .input(z.object({ username: z.string().min(3).max(20) }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      try {
        // Check if username already exists
        const existingUser = await prisma.user.findUnique({
          where: {
            username: input.username,
          },
        });

        if (existingUser) {
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

        return { status: "OK" };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        // Handle other errors
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
