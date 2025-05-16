"use client";

import { useSession } from "next-auth/react";
import { BsPencilSquare } from "react-icons/bs";

import { Button } from "@/components/ui/button";
import { useAnswerModalStore } from "@/modules/questions/ui/store/useAnswerModalStore";

interface ButtonAnswerProps {
  questionId: string;
  questionContent: string;
}

export const ButtonAnswer = ({
  questionId,
  questionContent,
}: ButtonAnswerProps) => {
  const { open } = useAnswerModalStore();
  const { status } = useSession();

  const handleOpen = () => {
    if (status === "unauthenticated") {
      return;
    }
    open({
      questionId,
      questionContent,
    });
  };
  return (
    <Button size="sm" variant="outline" onClick={handleOpen}>
      <div className="flex items-center gap-2">
        <BsPencilSquare />
        <span className="ml-2">Jawab</span>
      </div>
    </Button>
  );
};
