import { toast } from "react-toastify";

import { trpc } from "@/trpc/client";
import { useComment } from "./UseComment";

export const useCommentMutation = () => {
  const trpcUtils = trpc.useUtils();
  const { answerId, sort } = useComment();
  return trpc.comments.createTopLevelComment.useMutation({
    onSuccess: (comment) => {
      trpcUtils.comments.getTopLevelCommentsByAnswerId.cancel();

      trpcUtils.comments.getTopLevelCommentsByAnswerId.setInfiniteData(
        {
          answerId: answerId as string,
          sort,
        },
        (oldData) => {
          const firstPage = oldData?.pages[0];

          if (firstPage) {
            return {
              ...oldData,
              pages: [
                {
                  ...firstPage,
                  items: [comment, ...firstPage.items],
                },
              ],
            };
          }

          return oldData;
        },
      );
    },
    onError: () => {
      toast.error("Gagal mengirim komentar");
    },
  });
};
