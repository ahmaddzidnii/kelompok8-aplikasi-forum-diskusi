import Link from "next/link";
import { notFound } from "next/navigation";
import { FaChevronDown } from "react-icons/fa";
import { BsPencilSquare } from "react-icons/bs";

import { Button } from "@/components/ui/button";

import { QuestionCard } from "../components/QuestionCard";
import { ListsAnswerSection } from "../section/ListsAnswerSection";
import { Card, CardContent } from "@/components/ui/card";
import { AvatarComponent } from "@/components/AvatarComponent";
import { auth } from "@/auth";
import { trpc } from "@/trpc/server";
import logger from "@/lib/logger";

interface ThreadViewProps {
  threadSlug?: string;
}

export const ThreadView = async ({ threadSlug }: ThreadViewProps) => {
  let question, session;
  try {
    const questionData = await trpc.questions.getOne({
      slug: threadSlug as string,
    });
    question = questionData;
    const sessionData = await auth();
    session = sessionData;
  } catch (error) {
    logger.warn("Error fetching question:", error);
    return notFound();
  }

  return (
    <div className="space-y-4">
      <QuestionCard
        truncated={false}
        author={{
          username: question.user.username || "ahmaddzidnii",
          name: question.user.name || "Ahmad Zidni Hidayat",
          avatar: question.user.image || "/avatar.png",
          organization:
            question.user.organization || "Web Developer at Lorem .inc",
        }}
        question={{
          questonSlug:
            question.slug || "/threads/mengapa-react-js-sangat-popular-637353",
          content: question.content || "Mengapa React JS sangat populer?",
        }}
        createdAt={question.createdAt.toString()}
        withButton={false}
      />

      {session?.user && question.user.id != session.user.id && (
        <Card className="w-full rounded-lg border">
          <CardContent className="flex h-full w-full items-center justify-center gap-4 p-2">
            <div className="flex flex-col items-center justify-center gap-1 text-center">
              <AvatarComponent
                src={session?.user.image as string}
                alt="Me"
                fallback={session.user.name?.charAt(0).toUpperCase()}
              />
              <h1 className="text-base font-semibold">
                {session?.user.name?.split(" ")[0]} dapatkah Anda menjawab
                pertanyaan ini?
              </h1>
              <p className="text-[10px] text-muted-foreground">
                Orang-orang sedang mencari jawaban lebih baik untuk pertanyaan
                ini.
              </p>
              <Button size="sm" variant="outline">
                <Link href="/answers">
                  <div className="flex items-center gap-2">
                    <BsPencilSquare />
                    <span className="ml-2">Jawab</span>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex w-full items-center justify-between">
        <h1 className="text-base font-semibold">Jawaban :</h1>
        <Button variant="outline">
          <span className="text-[14px]">Disarankan</span>
          <FaChevronDown className="ml-2" />
        </Button>
      </div>

      <ListsAnswerSection />
    </div>
  );
};
