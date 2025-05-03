import { prisma } from "@/lib/prisma";
import { createTRPCRouter, publicProcedure } from "@/trpc/init";

export const categoriesRouter = createTRPCRouter({
  getMany: publicProcedure.query(async () => {
    const data = await prisma.category.findMany();
    return data;
  }),
});
