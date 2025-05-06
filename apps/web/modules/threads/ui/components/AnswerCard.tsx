import { Card, CardContent } from "@/components/ui/card";
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
      </CardContent>
    </Card>
  );
};
