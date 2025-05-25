import { z } from "zod";

export const answerSchema = z.object({
  questionId: z.string(),
  content: z.string().refine(
    (val) => {
      try {
        const parsed = JSON.parse(val);

        // Basic check
        if (parsed?.type !== "doc" || !Array.isArray(parsed.content)) {
          return false;
        }

        const content = parsed.content;

        // Jika semua paragraph kosong
        const hasNonEmptyParagraph = content.some((node: any) => {
          if (node.type !== "paragraph") return true; // dianggap non-kosong jika bukan paragraph
          if (!Array.isArray(node.content)) return false;
          return node.content.length > 0; // ada isinya
        });

        return hasNonEmptyParagraph;
      } catch {
        return false;
      }
    },
    {
      message: "Jawaban tidak boleh kosong",
    },
  ),
});
