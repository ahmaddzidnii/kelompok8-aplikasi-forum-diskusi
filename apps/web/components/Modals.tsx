"use client";

import { useEffect, useState } from "react";

import { UserVoteListModal } from "@/modules/votes/ui/components/UserVoteListModal";

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
    </>
  );
};
