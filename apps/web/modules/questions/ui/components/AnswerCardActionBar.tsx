"use client";

import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { FaBookmark, FaComment, FaRegBookmark } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { useComment } from "@/modules/comments/hooks/UseComment";
import { trpc } from "@/trpc/client";
import { config } from "@/config";
import { Loader } from "@/components/Loader";

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
  const { open, close, isOpen } = useComment();
  const { status } = useSession();
  const trpcUtils = trpc.useUtils();
  const upVoteMutation = trpc.votes.upVote.useMutation({
    onSuccess: ({ answerId }) => {
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

  const bookmarkMutation = trpc.bookmark.bookmark.useMutation({
    onSuccess: () => {
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
                    isBookmarked: !item.isBookmarked,
                  };
                }
                return item;
              }),
            })),
          };
        },
      );

      trpcUtils.bookmark.getBookmarks.invalidate();
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        toast.error("Silakan masuk untuk menyimpan jawaban");
      } else {
        toast.error("Terjadi kesalahan, silakan coba lagi");
      }
    },
  });

  const handleCommentClick = () => {
    if (isOpen) {
      close();
    } else {
      open(answerId);
    }
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

  const handleBookmarkClick = () => {
    if (count.isBookmarked) {
      bookmarkMutation.mutate({
        answerId,
        type: "remove",
      });
    } else {
      bookmarkMutation.mutate({
        answerId,
        type: "add",
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
        className="min-w-32 rounded-full"
      >
        {upVoteMutation.isPending ? (
          <Loader />
        ) : (
          `Dukung naik  • ${count.upVote}`
        )}
      </Button>
      <Button
        onClick={handleCommentClick}
        size="sm"
        variant="ghost"
        className="rounded-full text-xs"
      >
        <FaComment />
      </Button>
      {status === "authenticated" && (
        <Button
          onClick={handleBookmarkClick}
          disabled={bookmarkMutation.isPending}
          size="sm"
          variant="ghost"
          className="rounded-full text-xs"
        >
          {count.isBookmarked ? (
            <>
              <FaBookmark />
              Singkirkan
            </>
          ) : (
            <>
              <FaRegBookmark />
              Simpan
            </>
          )}
        </Button>
      )}
    </div>
  );
};
