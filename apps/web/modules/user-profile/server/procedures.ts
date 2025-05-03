import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure } from "@/trpc/init";

export const usersRouter = createTRPCRouter({
  getOneUser: publicProcedure
    .input(
      z.object({
        username: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: {
          username: input.username,
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

  getCountNavbar: publicProcedure.query(async () => {
    return {
      questionCount: 90,
      answerCount: 1298730,
    };
  }),

  getTitleByUsername: publicProcedure
    .input(
      z.object({
        username: z.string(),
      }),
    )
    .query(async ({ input }) => {
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
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return {
        title: `${user.name} (${user.username})`,
      };
    }),
});
