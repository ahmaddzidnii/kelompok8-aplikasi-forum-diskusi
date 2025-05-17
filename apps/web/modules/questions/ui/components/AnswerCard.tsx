import { Card, CardContent } from "@/components/ui/card";
import { CommentView } from "@/modules/comments/ui/components/CommentView";
import { useComment } from "@/modules/comments/hooks/UseComment";

import { UserMeta } from "./UserMeta";
import { AnswerCardActionBar } from "./AnswerCardActionBar";

interface AnswerCardProps {
  author: {
    username: string;
    name: string;
    avatar: string;
    bio?: string;
  };
  answerContent: string;
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
}: AnswerCardProps) => {
  const { isOpen } = useComment();
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

        <p className="text-base font-semibold">{answerContent}</p>

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
