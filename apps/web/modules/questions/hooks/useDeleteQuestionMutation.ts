import { toast } from "react-toastify";

import { trpc } from "@/trpc/client";

interface DeleteQuestionMutationProps {
  slug: string;
}

export const useDeleteQuestionMutation = ({
  slug,
}: DeleteQuestionMutationProps) => {
  const trpcUtils = trpc.useUtils();
  return trpc.questions.delete.useMutation({
    onSuccess: () => {
      toast.success("Berhasil menghapus pertanyaan.");
      trpcUtils.questions.getMany.setInfiniteData({ limit: 10 }, (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            items: page.items.filter((item) => item.slug !== slug),
          })),
        };
      });

      trpcUtils.questions.getRecommended.setInfiniteData(
        { categoryId: undefined },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: page.items.filter((item) => item.slug !== slug),
            })),
          };
        },
      );
    },

    onError: (error) => {
      toast.error(
        error.message || "Gagal menghapus pertanyaan, silakan coba lagi.",
      );
    },
  });
};
