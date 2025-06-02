"use client";

import { IoMdMore } from "react-icons/io";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { useDeleteQuestionMutation } from "../../hooks/useDeleteQuestionMutation";
import { useEditQuestionModal } from "../../hooks/useEditQuestionModal";

import { useConfirm } from "@omit/react-confirm-dialog";

interface QuestionCardDropdownActionProps {
  slug: string;
}

export const QuestionCardDropdownAction = ({
  slug,
}: QuestionCardDropdownActionProps) => {
  const { open } = useEditQuestionModal();
  const deleteQuestionMutation = useDeleteQuestionMutation({
    slug,
  });

  const confirm = useConfirm();

  const handleEdit = () => {
    open(slug);
  };

  const handleDelete = async () => {
    const ok = await confirm({
      title: "Hapus Pertanyaan",
      description: "Apakah Anda yakin ingin menghapus pertanyaan ini?",
      confirmText: "Hapus",
      cancelText: "Batal",
    });
    if (!ok) return;

    deleteQuestionMutation.mutate({ slug });
  };
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="[&_svg]:size-6">
          <IoMdMore />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          role="button"
          className="cursor-pointer"
          onClick={handleEdit}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          role="button"
          className="cursor-pointer"
          onClick={handleDelete}
        >
          Hapus
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
