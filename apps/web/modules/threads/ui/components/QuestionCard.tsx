import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserMeta } from "./UserMeta";

interface QuestionCardProps {
  author: {
    username: string;
    name: string;
    avatar: string;
    organization?: string;
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
          bio={author.organization}
          createdAt={createdAt}
        />

        <p className="line-clamp-4 max-h-24 overflow-hidden text-ellipsis text-base font-semibold">
          {question.content}
        </p>
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
