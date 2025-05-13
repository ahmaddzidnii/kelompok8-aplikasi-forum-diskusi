import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserMeta } from "./UserMeta";
import { cn } from "@/lib/utils";

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
  truncated?: boolean;
}

export const QuestionCard = ({
  author,
  createdAt,
  question,
  withButton = true,
  truncated = true,
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

        <p
          className={cn(
            "max-h-24 overflow-hidden text-ellipsis text-base font-semibold",
            truncated && "line-clamp-2",
          )}
        >
          {question.content}
        </p>
        {withButton && (
          <Button variant="default" className="w-full" asChild>
            <Link prefetch={false} href={`/questions/${question.questonSlug}`}>
              Lihat diskusi
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
