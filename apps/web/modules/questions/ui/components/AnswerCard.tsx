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
  count: {
    upVote: number;
    comment: number;
  };
  createdAt: string;
}

export const AnswerCard = ({
  author,
  createdAt,
  answerContent,
  count,
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

        <AnswerCardActionBar count={count} />

        {isOpen && (
          <div className="mt-4">
            <CommentView />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
