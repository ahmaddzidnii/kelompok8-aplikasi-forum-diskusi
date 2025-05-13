import { FaBookmark } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserMeta } from "@/modules/questions/ui/components/UserMeta";
import Link from "next/link";

interface BookmarkCardProps {
  author: {
    username: string;
    name: string;
    avatar: string;
    bio?: string;
  };
  answerContent: string;
  question: {
    questonSlug: string;
    content: string;
  };
  createdAt: string;
}

export const BookmarkCard = ({
  author,
  createdAt,
  answerContent,
  question,
}: BookmarkCardProps) => {
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
            href={`threads/${question.questonSlug}`}
            className="mt-4 text-base font-semibold"
          >
            {question.content}
          </Link>
        </p>
        <p className="text-sm">{answerContent}</p>

        <div className="flex items-center gap-2 border-t py-2.5">
          <Button size="sm" variant="ghost" className="rounded-full text-xs">
            <FaBookmark />
            <span>Hapus dari daftar simpan</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
