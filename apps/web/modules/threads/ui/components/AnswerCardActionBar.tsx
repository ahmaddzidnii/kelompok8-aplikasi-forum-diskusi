"use client";

import { FaBookmark, FaComment } from "react-icons/fa";

import { Button } from "@/components/ui/button";

interface AnswerCardActionBarProps {
  count: {
    upVote: number;
    comment: number;
  };
}

export const AnswerCardActionBar = ({ count }: AnswerCardActionBarProps) => {
  return (
    <div className="flex items-center gap-2 border-t py-2.5">
      <Button size="sm" className="rounded-full">
        Dukung naik • {count.upVote}
      </Button>
      <Button size="sm" variant="ghost" className="rounded-full text-xs">
        <FaComment />
        <span>{count.comment}</span>
      </Button>
      <Button size="sm" variant="ghost" className="rounded-full text-xs">
        <FaBookmark />
        <span>Simpan</span>
      </Button>
    </div>
  );
};
