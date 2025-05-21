import { toast } from "react-toastify";

import { trpc } from "@/trpc/client";
import { useComment } from "@/modules/comments/hooks/UseComment";

export const useCommentMutation = () => {
  const trpcUtils = trpc.useUtils();
  const { answerId } = useComment();

  return trpc.comments.createTopLevelComment.useMutation({
    onSuccess: (comment) => {
      // Cancel pending queries to avoid race conditions
      trpcUtils.comments.getTopLevelCommentsByAnswerId.cancel();

      // Helper function to update cache for both sort orders
      const updateCache = (sortOrder: "asc" | "desc") => {
        trpcUtils.comments.getTopLevelCommentsByAnswerId.setInfiniteData(
          {
            answerId: answerId as string,
            sort: sortOrder,
          },
          (oldData) => {
            if (!oldData) return oldData;

            const firstPage = oldData.pages[0];
            if (!firstPage) return oldData;

            // Create a new data structure with updated items
            const newItems =
              sortOrder === "desc"
                ? [comment, ...firstPage.items] // For desc, add at beginning
                : [...firstPage.items, comment]; // For asc, add at end

            return {
              ...oldData,
              pages: [
                {
                  ...firstPage,
                  items: newItems,
                },
                ...oldData.pages.slice(1), // Keep other pages unchanged
              ],
            };
          },
        );
      };

      // Update both sorting caches correctly
      updateCache("asc");
      updateCache("desc");

      // Invalidate queries to ensure consistent state
      trpcUtils.comments.getTopLevelCommentsByAnswerId.invalidate({
        answerId: answerId as string,
      });
    },
    onError: () => {
      toast.error("Gagal mengirim komentar");
    },
  });
};
