import Link from "next/link";
import { type JsonValue } from "@prisma/client/runtime/library";

import { Card, CardContent } from "@/components/ui/card";
import { CommentView } from "@/modules/comments/ui/components/CommentView";
import { useComment } from "@/modules/comments/hooks/UseComment";

import { UserMeta } from "./UserMeta";
import { AnswerCardActionBar } from "./AnswerCardActionBar";
import { useUserVoteListModal } from "@/modules/votes/hooks/useUserVoteListModal";

import "@/components/minimal-tiptap/styles/index.css";
import { TruncatedContent } from "./TruncatedContent";

interface AnswerCardProps {
  author: {
    username: string;
    name: string;
    avatar: string;
    bio?: string;
  };
  answerContent: JsonValue;
  answerId: string;
  count: {
    upVote: number;
    comment: number;
    isBookmarked: boolean;
  };
  createdAt: string;
  isAlreadyUpvoted: boolean;
  answerSort: "asc" | "desc" | "recommended";
  questionSlug: string;
  usersVoteUp?: {
    id: string;
    name: string;
    username: string;
    image: string;
  }[];
}

export const AnswerCard = ({
  author,
  createdAt,
  answerContent,
  answerId,
  count,
  isAlreadyUpvoted,
  answerSort,
  questionSlug,
  usersVoteUp = [],
}: AnswerCardProps) => {
  const { isOpen } = useComment();
  const { open } = useUserVoteListModal();

  const handleOpenListUserVote = () => {
    open(answerId);
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

        <TruncatedContent content={answerContent} />

        {usersVoteUp.length > 0 && (
          <div
            role="button"
            onClick={handleOpenListUserVote}
            className="flex cursor-pointer items-center gap-1 text-sm text-primary hover:underline"
          >
            <div className="flex -space-x-2 rounded-full p-1">
              {usersVoteUp.map((user, index) => (
                <Link href={`/@${user.username}`} key={user.id}>
                  <img
                    key={user.id}
                    src={user.image || "/avatar.png"}
                    alt={user.name || "User"}
                    className="relative size-7 rounded-full border-2 border-white shadow-sm transition-all hover:z-10 hover:scale-110 hover:shadow-md"
                    style={{
                      zIndex: usersVoteUp.length - index,
                    }}
                  />
                </Link>
              ))}
            </div>
            <p>{usersVoteUp.length > 1 && "dan lainnya "} mendukung ini</p>
          </div>
        )}

        <AnswerCardActionBar
          answerId={answerId}
          count={count}
          isAlreadyUpvoted={isAlreadyUpvoted}
          answerSort={answerSort}
          questionSlug={questionSlug}
        />

        {isOpen && (
          <div className="mt-4">
            <CommentView />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
