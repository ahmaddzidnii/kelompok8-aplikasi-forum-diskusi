import { notFound } from "next/navigation";

import { auth } from "@/auth";
import logger from "@/lib/logger";
import { trpc } from "@/trpc/server";
import { Card, CardContent } from "@/components/ui/card";
import { AvatarComponent } from "@/components/AvatarComponent";
import { ButtonAnswer } from "../components/ButtonAnswer";
import { QuestionCard } from "../components/QuestionCard";
import { ListsAnswerSection } from "../section/ListsAnswerSection";
import { AnswerFilter } from "../components/AnswerFilter";
import { CardInfoUserHasAnswers } from "../components/CardInfoUserHasAnswers";

interface QuestionDetailProps {
  threadSlug: string;
}

export const QuestionDetail = async ({ threadSlug }: QuestionDetailProps) => {
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
          categories: question.questionCategories.map((category) => ({
            categoryId: category.category.categoryId,
            name: category.category.name,
          })),
        }}
        createdAt={question.createdAt.toString()}
        withButton={false}
        hasAccessToModify={false}
      />

      {session?.user &&
        question.user.id != session.user.id &&
        !question.hasAnswered && (
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
                <ButtonAnswer
                  questionId={question.questionId}
                  questionContent={question.content}
                />
              </div>
            </CardContent>
          </Card>
        )}

      {question.hasAnswered && <CardInfoUserHasAnswers question={question} />}

      <AnswerFilter />

      <ListsAnswerSection questionSlug={threadSlug} />
    </div>
  );
};
