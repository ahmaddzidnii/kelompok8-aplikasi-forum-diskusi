"use client";

import { useEffect, useState } from "react";

import { UserVoteListModal } from "@/modules/votes/ui/components/UserVoteListModal";
import { EditQuestionModal } from "@/modules/questions/ui/components/EditQuestionModal";

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
      <UserVoteListModal />
      <EditQuestionModal />
    </>
  );
};
