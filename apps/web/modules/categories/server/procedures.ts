import { TRPCError } from "@trpc/server";

import logger from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { createTRPCRouter, publicProcedure } from "@/trpc/init";

export const categoriesRouter = createTRPCRouter({
  getMany: publicProcedure.query(async () => {
    logger.info("Fetching all categories from the database.");
    try {
      const data = await prisma.category.findMany({
        include: {
          _count: {
            select: {
              questionCategories: true,
            },
          },
          questionCategories: {
            take: 3,
            orderBy: {
              question: {
                createdAt: "desc",
              },
            },
            include: {
              question: {
                select: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      image: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      logger.debug(`Fetched ${data.length} categories.`);

      const formatedCategories = data.map((category) => ({
        categoryId: category.categoryId,
        name: category.name,
        description: category.description,
        _count: {
          question: category._count.questionCategories,
        },
        recentQuestionAuthors: category.questionCategories.map((qc) => ({
          id: qc.question.user.id,
          name: qc.question.user.name,
          image: qc.question.user.image,
        })),
      }));

      return formatedCategories;
    } catch (error) {
      logger.error(`Error fetching categories: ${(error as Error).message}`);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch categories",
      });
    }
  }),
});
