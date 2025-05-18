import Link from "next/link";
import { toast } from "react-toastify";
import { FaBookmark } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserMeta } from "@/modules/questions/ui/components/UserMeta";
import { trpc } from "@/trpc/client";
import { config } from "@/config";

interface BookmarkCardProps {
  author: {
    username: string;
    name: string;
    avatar: string;
    bio?: string;
  };
  answerContent: string;
  answerId: string;
  question: {
    content: string;
    questonSlug: string;
  };
  createdAt: string;
}

export const BookmarkCard = ({
  author,
  createdAt,
  answerContent,
  question,
  answerId,
}: BookmarkCardProps) => {
  const trpcUtils = trpc.useUtils();
  const bookmarkMutation = trpc.bookmark.bookmark.useMutation({
    onSuccess: ({ bookmarkId }) => {
      // Update the bookmarks infinite query cache
      trpcUtils.bookmark.getBookmarks.setInfiniteData(
        {
          limit: config.bookmarks.defaultLimit,
        },
        (oldData) => {
          if (!oldData) return oldData;

          // For bookmark deletion, remove the item with matching bookmarkId from the cache
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: page.items.filter(
                (item) => item.answer.bookmarkId !== bookmarkId,
              ),
            })),
          };
        },
      );

      trpcUtils.answers.invalidate();
    },
    onError: (error) => {
      toast.error("Gagal menghapus bookmark");
      console.error("Error unbookmarking:", error);
    },
  });
  const handleUnbookmark = () => {
    bookmarkMutation.mutate({
      answerId,
      type: "remove",
    });
  };
  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <UserMeta
          username={author.username}
          name={author.name}
          avatar={author.avatar}
          bio={author.bio}
          createdAt={createdAt}
        />
        <p>
          <Link
            href={`questions/${question.questonSlug}`}
            className="mt-4 text-base font-semibold"
          >
            {question.content}
          </Link>
        </p>
        <p className="text-sm">{answerContent}</p>

        <div className="flex items-center gap-2 border-t py-2.5">
          <Button
            disabled={bookmarkMutation.isPending}
            onClick={handleUnbookmark}
            size="sm"
            variant="ghost"
            className="rounded-full text-xs"
          >
            <FaBookmark />
            <span>Hapus dari daftar simpan</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
