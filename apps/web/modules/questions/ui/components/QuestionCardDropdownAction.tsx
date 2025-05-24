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
import { useConfirm } from "@/hooks/useConfirm";

interface QuestionCardDropdownActionProps {
  slug: string;
}

export const QuestionCardDropdownAction = ({
  slug,
}: QuestionCardDropdownActionProps) => {
  const deleteQuestionMutation = useDeleteQuestionMutation({
    slug,
  });

  const [ConfirmDialog, confirm] = useConfirm(
    "Hapus Pertanyaan",
    "Apakah Anda yakin ingin menghapus pertanyaan ini?",
  );

  const handleEdit = () => {
    // Handle edit action
  };

  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    deleteQuestionMutation.mutate({ slug });
  };
  return (
    <>
      <ConfirmDialog />
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
    </>
  );
};
