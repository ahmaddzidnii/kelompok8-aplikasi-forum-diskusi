import { z } from "zod";

export const answerSchema = z.object({
  questionId: z.string(),
  content: z.string().min(1, { message: "Answer is required" }),
});
