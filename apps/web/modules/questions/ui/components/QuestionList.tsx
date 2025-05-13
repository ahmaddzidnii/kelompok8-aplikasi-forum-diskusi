"use client";

import { Suspense } from "react";
import { id } from "date-fns/locale";
import { Loader2Icon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ErrorBoundary } from "react-error-boundary";

import { config } from "@/config";
import { trpc } from "@/trpc/client";
import { InfiniteScroll } from "@/components/InfiniteScroll";
import { QuestionCard } from "@/modules/questions/ui/components/QuestionCard";
import { EmptyState } from "@/components/EmptyState";
import { InternalServerError } from "@/components/InternalServerErrorFallback";

export const QuestionsList = () => {
  return (
    <Suspense fallback={<Loader2Icon size={48} className="animate-spin" />}>
      <ErrorBoundary fallback={<InternalServerError />}>
        <QuestionsListSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const QuestionsListSuspense = () => {
  const [data, query] = trpc.questions.getMany.useSuspenseInfiniteQuery(
    {
      limit: config.questions.defaultLimit,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const questions = data.pages.flatMap((page) => page.items);

  if (questions.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {questions.map((question, idx) => (
        <li key={question.questionId + idx} className="mb-4">
          <QuestionCard
            question={{
              content: question.content || "Apa itu Next.js?",
              questonSlug: question.slug,
            }}
            author={{
              name: question.user.name || "Ahmad Zidni Hidayat",
              avatar: question.user.image || "/avatar.png",
              username: question.user.username || "ahmadzidni",
              organization:
                question.user.organization || "Web Developer at XYZ",
            }}
            createdAt={question.createdAt.toString()}
          />
        </li>
      ))}
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </ul>
  );
};
