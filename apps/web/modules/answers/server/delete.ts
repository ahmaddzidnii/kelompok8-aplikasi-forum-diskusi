import logger from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

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
      // Single query untuk get answer dan validasi ownership
      const answer = await prisma.answer.findUnique({
        where: {
          answerId,
          userId: session?.user.id, // Langsung filter berdasarkan ownership
        },
        select: {
          answerId: true, // Untuk konfirmasi exist
          question: {
            select: {
              slug: true,
            },
          },
        },
      });

      if (!answer) {
        // Check apakah answer exist tapi bukan milik user
        const answerExists = await prisma.answer.findUnique({
          where: { answerId },
          select: { answerId: true },
        });

        if (!answerExists) {
          logger.warn(`Answer not found: answerId=${answerId}`);
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Jawaban tidak ditemukan",
          });
        } else {
          logger.warn(
            `User attempted to delete another user's answer: userId=${session?.user.id}, answerId=${answerId}`,
          );
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Anda tidak memiliki izin untuk menghapus jawaban ini",
          });
        }
      }

      // Delete answer dengan conditional delete untuk memastikan ownership
      const deletedAnswer = await prisma.answer.deleteMany({
        where: {
          answerId,
          userId: session?.user.id,
        },
      });

      if (deletedAnswer.count === 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Anda tidak memiliki izin untuk menghapus jawaban ini",
        });
      }

      logger.info(
        `Answer deleted successfully: answerId=${answerId}, userId=${session?.user.id}`,
      );

      return {
        questionSlug: answer.question.slug,
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

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
