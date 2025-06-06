"use client";

import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { inferRouterOutputs } from "@trpc/server";
import { CheckCircle, Edit, Trash2 } from "lucide-react";

import { AvatarComponent } from "@/components/AvatarComponent";
import { LoadingButton } from "@/components/ui/loading-button";
import { Card, CardContent } from "@/components/ui/card";
import { AppRouter } from "@/trpc/routers/_app";
import { trpc } from "@/trpc/client";
import { useConfirm } from "@omit/react-confirm-dialog";
import { useEditAnswerModal } from "@/modules/answers/ui/hooks/useEditAnswerModal";

type RouterOutputs = inferRouterOutputs<AppRouter>;

interface CardInfoUserHasAnswersProps {
  question: RouterOutputs["questions"]["getOne"];
}

export const CardInfoUserHasAnswers = ({
  question,
}: CardInfoUserHasAnswersProps) => {
  const router = useRouter();
  const confirm = useConfirm();
  const { openEditModal } = useEditAnswerModal();

  const deleteAnswerMutation = trpc.answers.delete.useMutation({
    onSuccess: () => {
      toast.success("Jawaban Anda berhasil dihapus.");
      router.refresh();
    },
    onError: (error) => {
      toast.error(`Gagal menghapus jawaban: ${error.message}`);
    },
  });
  const handleEditAnswer = () => {
    if (typeof window == "undefined") return;
    openEditModal({
      answerId: question.userAnswer?.answerId || "",
      answerContent: question.userAnswer?.content || "",
      questionContent: question.content || "",
    });
  };

  const handleDeleteAnswer = async () => {
    if (typeof window == "undefined") return;

    const isConfirmed = await confirm({
      title: "Konfirmasi Hapus Jawaban",
      description: "Apakah Anda yakin ingin menghapus jawaban ini?",
      confirmText: "Hapus",
      cancelText: "Batal",
    });

    if (!isConfirmed) return;

    deleteAnswerMutation.mutate({
      answerId: question.userAnswer?.answerId || "",
    });
  };

  return (
    <Card className="w-full rounded-lg border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <AvatarComponent
                src={question.userAnswer?.user.image || "/avatar.png"}
                alt={question.userAnswer?.user.name || "User"}
                fallback={question.userAnswer?.user.name
                  ?.charAt(0)
                  .toUpperCase()}
                className="h-6 w-6"
              />
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  Jawaban Anda Berhasil Dikirim
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  Terima kasih atas kontribusi Anda pada pertanyaan ini
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <LoadingButton
                variant="outline"
                size="sm"
                onClick={handleEditAnswer}
              >
                <Edit className="mr-1 h-3 w-3" />
                Edit Jawaban
              </LoadingButton>

              <LoadingButton
                variant="destructive"
                size="sm"
                loading={deleteAnswerMutation.isPending}
                onClick={handleDeleteAnswer}
              >
                <Trash2 className="mr-1 h-3 w-3" />
                Hapus jawaban anda
              </LoadingButton>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
