import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserMeta } from "./UserMeta";

interface QuestionCardProps {
  author: {
    username: string;
    name: string;
    avatar: string;
    bio?: string;
  };
  question: {
    questonSlug: string;
    content: string;
  };
  createdAt: string;
  withButton?: boolean;
}

export const QuestionCard = ({
  author,
  createdAt,
  question,
  withButton = true,
}: QuestionCardProps) => {
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

        <p className="text-base font-semibold">{question.content}</p>
        {withButton && (
          <Button variant="default" className="w-full" asChild>
            <Link prefetch={false} href={`/threads/${question.questonSlug}`}>
              Lihat diskusi
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
