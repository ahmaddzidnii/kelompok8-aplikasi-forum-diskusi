"use client";

import { Suspense } from "react";
import { useSession } from "next-auth/react";

import { ErrorBoundary } from "react-error-boundary";

import { config } from "@/config";
import { trpc } from "@/trpc/client";
import { InfiniteScroll } from "@/components/InfiniteScroll";
import { QuestionCard } from "@/modules/questions/ui/components/QuestionCard";
import { EmptyState } from "@/components/EmptyState";
import { InternalServerError } from "@/components/InternalServerErrorFallback";
import { Loader } from "@/components/Loader";

export const QuestionsList = () => {
  return (
    <Suspense fallback={<Loader />}>
      <ErrorBoundary fallback={<InternalServerError />}>
        <QuestionsListSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const QuestionsListSuspense = () => {
  const { data: session } = useSession();

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
              questonSlug: question.slug,
              content: question.content || "Apa itu Next.js?",
              categories: question.questionCategories.map((category) => ({
                categoryId: category.category.categoryId,
                name: category.category.name,
              })),
            }}
            author={{
              name: question.user.name || "Ahmad Zidni Hidayat",
              avatar: question.user.image || "/avatar.png",
              username: question.user.username || "ahmadzidni",
              organization:
                question.user.organization || "Web Developer at XYZ",
            }}
            createdAt={question.createdAt.toString()}
            hasAccessToModify={session?.user.id == question.user.id}
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
