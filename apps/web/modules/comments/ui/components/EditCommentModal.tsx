import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { trpc } from "@/trpc/client";
import { LoadingButton } from "@/components/ui/loading-button";

import { useEditCommentModal } from "../../hooks/useEditCommentModal";
import { Loader } from "@/components/Loader";

export const EditCommentModal = () => {
  const { closeModal, isOpen, commentId } = useEditCommentModal();
  const { data, isLoading } = trpc.comments.getOne.useQuery(
    {
      commentId: commentId || "",
    },

    {
      enabled: Boolean(commentId && isOpen),
    },
  );
  const [newContent, setNewContent] = useState(data?.content || "");

  const trpcUtils = trpc.useUtils();
  const { mutate, isPending } = trpc.comments.edit.useMutation({
    onSuccess: () => {
      trpcUtils.comments.invalidate();
      handleClose();
      toast.success("Komentar berhasil diperbarui.");
    },
    onError: (error) => {
      toast.error(`Gagal memperbarui komentar: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newContent.trim()) {
      toast.error("Komentar tidak boleh kosong.");
      return;
    }

    mutate({
      commentId: commentId || "",
      content: newContent,
    });
  };

  useEffect(() => {
    if (data) {
      setNewContent(data.content);
    }
  }, [data]);

  const handleClose = () => {
    setNewContent("");
    closeModal();
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Komentar</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full resize-none rounded border p-2"
              placeholder="Edit your comment here..."
            />
            <LoadingButton loading={isPending} className="w-full">
              Simpan
            </LoadingButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
