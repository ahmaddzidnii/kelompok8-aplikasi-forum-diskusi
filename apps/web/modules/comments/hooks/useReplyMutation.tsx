import { toast } from "react-toastify";

import { trpc } from "@/trpc/client";

export const useReplyMutation = () => {
  const trpcUtils = trpc.useUtils();

  return trpc.comments.createReply.useMutation({
    onSuccess: () => {
      trpcUtils.comments.invalidate();
    },
    onError: () => {
      toast.error("Gagal mengirim komentar");
    },
  });
};
