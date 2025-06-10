import { z } from "zod";
import { TRPCError } from "@trpc/server";

import logger from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { protectedProcedure } from "@/trpc/init";

export const deleteAnswer = protectedProcedure
  .input(
    z.object({
      answerId: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { answerId } = input;
    const session = ctx.session;

    logger.debug(
      `Attempting to delete answer: answerId=${answerId}, userId=${session?.user.id}`,
    );

    try {
      const answer = await prisma.answer.findUnique({
        where: { answerId },
        select: {
          userId: true,
          question: {
            select: {
              slug: true,
            },
          },
        },
      });

      if (!answer) {
        logger.warn(`Answer not found: answerId=${answerId}`);
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Jawaban tidak ditemukan",
        });
      }

      if (answer.userId !== session?.user.id) {
        logger.warn(
          `User attempted to delete another user's answer: userId=${session?.user.id}, answerId=${answerId}`,
        );
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Anda tidak memiliki izin untuk menghapus jawaban ini",
        });
      }

      await prisma.answer.delete({
        where: { answerId },
      });

      logger.info(
        `Answer deleted successfully: answerId=${answerId}, userId=${session?.user.id}`,
      );

      return {
        questionSlug: answer.question.slug,
      };
    } catch (error) {
      logger.error(
        `Error deleting answer: ${
          error instanceof Error ? error.message : String(error)
        } | answerId=${answerId}`,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Gagal menghapus jawaban, silakan coba lagi nanti",
      });
    }
  });
