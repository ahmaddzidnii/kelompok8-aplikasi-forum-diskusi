import { z } from "zod";
import { type Session } from "next-auth";
import { TRPCError } from "@trpc/server";

import { prisma } from "@/lib/prisma";
import { askFormSchema } from "@/modules/questions/schema";
import { generateSlug } from "./generateSlug";

export const generateQuestion = async (
  input: z.infer<typeof askFormSchema>,
  session: Session | null,
): Promise<string> => {
  // kita akan return slug sebagai string
  const slug = await prisma.$transaction(async (tx) => {
    const { categories, questionContent } = input;

    // validasi kategori
    const existingCategories = await tx.category.findMany({
      where: { categoryId: { in: categories.map((c) => c.value) } },
      select: { categoryId: true },
    });
    if (existingCategories.length !== categories.length) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "One or more categories are invalid.",
      });
    }

    // buat question
    const question = await tx.question.create({
      data: {
        slug: generateSlug(questionContent.split(" ").slice(0, 10).join(" ")),
        content: questionContent,
        user: { connect: { id: session?.user.id } },
      },
    });

    // buat relasi kategori
    const questionCategoryData = categories.map((category) => ({
      questionId: question.questionId,
      categoryId: category.value,
    }));
    await tx.questionCategory.createMany({
      data: questionCategoryData,
      skipDuplicates: true,
    });

    // return slug yang baru dibuat
    return question.slug;
  });

  return slug;
};
