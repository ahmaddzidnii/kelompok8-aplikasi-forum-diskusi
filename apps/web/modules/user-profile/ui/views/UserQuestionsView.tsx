"use client";

import Link from "next/link";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { Loader } from "@/components/Loader";
import { InternalServerError } from "@/components/InternalServerErrorFallback";
import { trpc } from "@/trpc/client";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { EmptyState } from "@/components/EmptyState";
import { InfiniteScroll } from "@/components/InfiniteScroll";

interface UserQuestionsViewProps {
  username: string;
}

export const UserQuestionView = ({ username }: UserQuestionsViewProps) => {
  return (
    <Suspense fallback={<Loader />}>
      <ErrorBoundary fallback={<InternalServerError />}>
        <UserQuestionsViewSuspense username={username} />
      </ErrorBoundary>
    </Suspense>
  );
};

const UserQuestionsViewSuspense = ({ username }: UserQuestionsViewProps) => {
  const [questions, query] =
    trpc.users.getQuestionsByUsername.useSuspenseInfiniteQuery(
      {
        username,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const questionsList = questions.pages.flatMap((page) => page.items);

  if (questionsList.length === 0) {
    return <EmptyState />;
  }

  return (
    <div>
      <ul className="flex flex-col gap-2">
        {questionsList.map((question, index) => (
          <li
            key={index}
            className="flex flex-col gap-1.5 border-t px-2.5 py-3"
          >
            <Link
              href={`/questions/${question.slug}`}
              className="text-base font-bold"
            >
              {question.content || "Optimalisasi PHP atau ganti aja?"}
            </Link>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold">
                {question._count.answers || 0} Answers
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(question.createdAt, {
                  addSuffix: true,
                  locale: id,
                  includeSeconds: true,
                }).replace(/^\s*\D*?(\d+.*)/, "$1")}
              </p>
            </div>
          </li>
        ))}
        <InfiniteScroll
          isManual
          fetchNextPage={query.fetchNextPage}
          hasNextPage={query.hasNextPage}
          isFetchingNextPage={query.isFetchingNextPage}
        />
      </ul>
    </div>
  );
};
