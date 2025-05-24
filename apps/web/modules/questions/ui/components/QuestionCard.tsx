import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { cn } from "@/lib/utils";

import { UserMeta } from "./UserMeta";
import { QuestionCardDropdownAction } from "./QuestionCardDropdownAction";
import { Badge } from "@/components/ui/badge";

interface QuestionCardProps {
  author: {
    username: string;
    name: string;
    avatar: string;
    organization?: string;
  };
  question: {
    content: string;
    questonSlug: string;
    categories: {
      categoryId: string;
      name: string;
    }[];
  };
  createdAt: string;
  withButton?: boolean;
  truncated?: boolean;
  hasAccessToModify: boolean;
}

export const QuestionCard = ({
  author,
  createdAt,
  question,
  withButton = true,
  truncated = true,
  hasAccessToModify,
}: QuestionCardProps) => {
  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center">
          <div className="flex-1">
            <UserMeta
              username={author.username}
              name={author.name}
              avatar={author.avatar}
              bio={author.organization}
              createdAt={createdAt}
            />
          </div>
          {hasAccessToModify && (
            <div className="shrink-0">
              <QuestionCardDropdownAction slug={question.questonSlug} />
            </div>
          )}
        </div>

        <p
          className={cn(
            "max-h-24 overflow-hidden text-ellipsis text-base font-semibold",
            truncated && "line-clamp-2",
          )}
        >
          {question.content}
        </p>

        <div className="flex flex-wrap gap-1">
          {question.categories.map((category) => (
            <Link
              href={`/?categoryId=${category.categoryId}`}
              key={category.categoryId}
              prefetch={false}
            >
              <Badge
                key={category.categoryId}
                className="flex items-center gap-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
              >
                <span>{category.name}</span>
              </Badge>
            </Link>
          ))}
        </div>
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
