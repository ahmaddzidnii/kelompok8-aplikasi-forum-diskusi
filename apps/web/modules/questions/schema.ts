import { z } from "zod";

export const askFormSchema = z.object({
  categories: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      }),
    )
    .max(5, "Pilih maksimal 5 kategori")
    .nonempty("Pilih minimal 1 kategori"),
  questionContent: z.string().min(3, "Pertanyaan harus lebih dari 3 karakter"),
});

export const updateQuestionSchema = z.object({
  slug: z.string().min(1, "Slug tidak boleh kosong"),
  categories: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      }),
    )
    .max(5, "Pilih maksimal 5 kategori")
    .nonempty("Pilih minimal 1 kategori"),
  questionContent: z.string().min(3, "Pertanyaan harus lebih dari 3 karakter"),
});
