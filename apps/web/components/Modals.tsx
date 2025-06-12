"use client";

import { useEffect, useState } from "react";

import { UserVoteListModal } from "@/modules/votes/ui/components/UserVoteListModal";
import { EditQuestionModal } from "@/modules/questions/ui/components/EditQuestionModal";
import { EditCommentModal } from "@/modules/comments/ui/components/EditCommentModal";
import { EditAnswerModal } from "@/modules/answers/ui/components/EditAnswerModal";
import { SearchModal } from "@/modules/search/ui/components/SearchModal";

export const Modals = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <SearchModal />
      <EditQuestionModal />
      <EditAnswerModal />
      <EditCommentModal />
      <UserVoteListModal />
    </>
  );
};
