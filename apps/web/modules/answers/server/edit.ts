import { z } from "zod";
import { TRPCError } from "@trpc/server";

import logger from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { protectedProcedure } from "@/trpc/init";
import { extractImageAttrsFromTiptapJSON } from "./utils";

export const edit = protectedProcedure
  .input(
    z.object({
      answerId: z.string(),
      content: z.string().min(1, "Konten jawaban tidak boleh kosong"),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { answerId, content } = input;
    const session = ctx.session;
    logger.debug(
      `Attempting to edit answer: answerId=${answerId}, userId=${session?.user.id}`,
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
          `User attempted to edit another user's answer: userId=${session?.user.id}, answerId=${answerId}`,
        );
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Anda tidak memiliki izin untuk mengedit jawaban ini",
        });
      }

      const contentJson = JSON.parse(content);
      const images = extractImageAttrsFromTiptapJSON(contentJson);

      logger.debug(
        `Extracted ${images.length} images from content for answerId=${answerId}`,
      );

      const existingImages = await prisma.image.findMany({
        where: {
          key: {
            in: images.map((img) => img.id),
          },
        },
        select: {
          imageId: true,
        },
      });

      logger.debug(
        `Found ${existingImages.length} existing images for answerId=${answerId}`,
      );
      const updatedAnswer = await prisma.answer.update({
        where: { answerId },
        data: { content: contentJson },
      });

      // update image dengan isUsed true
      await prisma.image.updateMany({
        where: {
          key: {
            in: images.map((img) => img.id),
          },
        },
        data: {
          isUsed: true,
        },
      });

      logger.info(
        `Answer edited successfully: answerId=${updatedAnswer.answerId}, userId=${session?.user.id}`,
      );

      return {
        questionSlug: answer.question.slug,
      };
    } catch (error) {
      logger.error(
        `Error editing answer: ${
          error instanceof Error ? error.message : String(error)
        } | answerId=${answerId}`,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Gagal mengedit jawaban, silakan coba lagi nanti",
      });
    }
  });
