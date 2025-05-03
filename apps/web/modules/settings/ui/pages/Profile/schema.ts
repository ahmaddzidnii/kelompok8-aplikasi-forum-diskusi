import { z } from "zod";

export const settingsProfileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  location: z
    .string()
    .transform((val) => (val.trim() === "" ? undefined : val))
    .optional(),
  organization: z
    .string()
    .transform((val) => (val.trim() === "" ? undefined : val))
    .optional(),
  bio: z
    .string()
    .max(50, {
      message: "Bio tidak boleh lebih 50 karakter.",
    })
    .transform((val) => (val.trim() === "" ? undefined : val))
    .optional(),
});
