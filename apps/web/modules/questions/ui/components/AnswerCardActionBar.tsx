"use client";

import { toast } from "react-toastify";
import { FaBookmark, FaComment } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { useComment } from "@/modules/comments/hooks/UseComment";
import { trpc } from "@/trpc/client";
import { config } from "@/config";

interface AnswerCardActionBarProps {
  count: {
    upVote: number;
    comment: number;
    isBookmarked: boolean;
  };
  answerId: string;
  isAlreadyUpvoted: boolean;
  answerSort: "asc" | "desc" | "recommended";
  questionSlug: string;
}

export const AnswerCardActionBar = ({
  count,
  answerId,
  isAlreadyUpvoted,
  answerSort,
  questionSlug,
}: AnswerCardActionBarProps) => {
  const { setIsOpen, isOpen } = useComment();
  const trpcUtils = trpc.useUtils();
  const upVoteMutation = trpc.votes.upVote.useMutation({
    onSuccess: ({ answerId }) => {
      toast.success(
        isAlreadyUpvoted ? "Dihapus dari dukungan" : "Didukung naik",
      );

      // Update data in all cache entries that might contain this answer
      trpcUtils.answers.getMany.setInfiniteData(
        {
          limit: config.answers.defaultLimit,
          sort: answerSort,
          questionSlug: questionSlug,
        },
        (oldData) => {
          if (!oldData) return oldData;

          // Keep the page structure intact
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: page.items.map((item) => {
                if (item.answerId === answerId) {
                  return {
                    ...item,
                    _count: {
                      ...item._count,
                      upvotesAnswer: isAlreadyUpvoted
                        ? item._count.upvotesAnswer - 1
                        : item._count.upvotesAnswer + 1,
                    },
                    isAlreadyUpvoted: !isAlreadyUpvoted,
                  };
                }
                return item;
              }),
            })),
          };
        },
      );
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        toast.error("Silakan masuk untuk memberikan dukungan");
      } else {
        toast.error("Terjadi kesalahan, silakan coba lagi");
      }
    },
  });

  const handleCommentClick = () => {
    setIsOpen(!isOpen);
  };

  const handleUpVoteClick = () => {
    if (isAlreadyUpvoted) {
      upVoteMutation.mutate({
        answerId,
        type: "cancelVote",
      });
    } else {
      upVoteMutation.mutate({
        answerId: answerId,
        type: "upVote",
      });
    }
  };

  return (
    <div className="flex items-center gap-2 border-t py-2.5">
      <Button
        variant={isAlreadyUpvoted ? "default" : "outline"}
        onClick={handleUpVoteClick}
        size="sm"
        disabled={upVoteMutation.isPending}
        className="rounded-full"
      >
        Dukung naik • {count.upVote}
      </Button>
      <Button
        onClick={handleCommentClick}
        size="sm"
        variant="ghost"
        className="rounded-full text-xs"
      >
        <FaComment />
      </Button>
      {count.isBookmarked ? (
        <Button size="sm" variant="ghost" className="rounded-full text-xs">
          <FaBookmark />
          <span>Hapus dari simpan</span>
        </Button>
      ) : (
        <Button size="sm" variant="ghost" className="rounded-full text-xs">
          <FaBookmark />
          <span>Simpan</span>
        </Button>
      )}
    </div>
  );
};
