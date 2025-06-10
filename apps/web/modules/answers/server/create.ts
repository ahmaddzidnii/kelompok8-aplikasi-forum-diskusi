import { TRPCError } from "@trpc/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import logger from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { protectedProcedure } from "@/trpc/init";

import { answerSchema } from "../schema";
import { extractImageAttrsFromTiptapJSON } from "./utils";

export const createAnswer = protectedProcedure
  .input(answerSchema)
  .mutation(async ({ input, ctx }) => {
    try {
      const { questionId, content } = input;
      const session = ctx.session;

      logger.debug(
        `Attempting to create answer: questionId=${questionId}, userId=${session?.user.id}`,
      );

      const question = await prisma.question.findUnique({
        where: { questionId },
        select: { userId: true, slug: true },
      });
      if (!question) {
        logger.warn(`Question not found: questionId=${questionId}`);
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Pertanyaan tidak ditemukan",
        });
      }

      // 2. Cek user tidak menjawab sendiri
      if (question.userId === session?.user.id) {
        logger.warn(
          `User attempted to answer their own question: userId=${session?.user.id}, questionId=${questionId}`,
        );
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Anda tidak bisa menjawab pertanyaan sendiri",
        });
      }

      const contentJson = JSON.parse(content);
      const images = extractImageAttrsFromTiptapJSON(contentJson);

      logger.debug(
        `Extracted ${images.length} images from content for questionId=${questionId}`,
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
        `Found ${existingImages.length} existing images for questionId=${questionId}`,
      );

      // Buat jawaban
      const answer = await prisma.answer.create({
        data: {
          userId: session?.user.id!,
          questionId,
          content: contentJson,
          images: {
            connect: existingImages,
          },
        },
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
        `Answer created: answerId=${answer.answerId}, questionId=${questionId}, userId=${session?.user.id}`,
      );

      return {
        answerId: answer.answerId,
        questionSlug: question.slug,
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        (error.meta?.target as string[])?.includes("userId_questionId")
      ) {
        logger.warn(
          `Duplicate answer attempt: userId_questionId constraint violated`,
        );
        throw new TRPCError({
          code: "CONFLICT",
          message: "Anda sudah menjawab pertanyaan ini sebelumnya",
        });
      }

      if (error instanceof TRPCError) {
        logger.debug(`TRPCError thrown in createAnswer: ${error.message}`);
        throw error;
      }

      logger.error(
        `Unexpected error creating answer: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Gagal membuat jawaban, silakan coba lagi nanti",
      });
    }
  });
