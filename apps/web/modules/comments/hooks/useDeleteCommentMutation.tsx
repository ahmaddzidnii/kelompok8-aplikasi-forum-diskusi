import { trpc } from "@/trpc/client";

export const useDeleteCommentMutation = () => {
  const trpcUtils = trpc.useUtils();
  return trpc.comments.delete.useMutation({
    onSuccess: () => {
      trpcUtils.comments.invalidate();
    },
    onError: (e) => {
      console.log("Error deleting comment:", e);
    },
  });
};
