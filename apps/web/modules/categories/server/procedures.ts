import { TRPCError } from "@trpc/server";

import logger from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { createTRPCRouter, publicProcedure } from "@/trpc/init";

export const categoriesRouter = createTRPCRouter({
  getMany: publicProcedure.query(async () => {
    logger.info("Fetching all categories from the database.");
    try {
      const data = await prisma.category.findMany();
      logger.debug(`Fetched ${data.length} categories.`);
      return data;
    } catch (error) {
      logger.error(`Error fetching categories: ${(error as Error).message}`);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch categories",
      });
    }
  }),
});
