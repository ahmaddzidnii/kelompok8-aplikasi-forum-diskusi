"use client";

import { Suspense } from "react";
import { useSession } from "next-auth/react";

import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import { EmptyState } from "@/components/EmptyState";
import { InfiniteScroll } from "@/components/InfiniteScroll";
import { InternalServerError } from "@/components/InternalServerErrorFallback";
import { QuestionCard } from "@/modules/questions/ui/components/QuestionCard";
import { Loader } from "@/components/Loader";

export const ThreadsListSection = ({ categoryId }: { categoryId?: string }) => {
  return (
    <Suspense fallback={<Loader />}>
      <ErrorBoundary fallback={<InternalServerError />}>
        <ThreadsListSectionSuspense categoryId={categoryId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const ThreadsListSectionSuspense = ({
  categoryId,
}: {
  categoryId?: string;
}) => {
  const { data: session } = useSession();

  const [data, query] = trpc.questions.getRecommended.useSuspenseInfiniteQuery(
    {
      categoryId,
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
            author={{
              username: question.user.username || "ahmaddzidnii",
              name: question.user.name || "Ahmad Zidni Hidayat",
              avatar: question.user.image || "/avatar.png",
              organization:
                question.user.organization || "Web Developer at Lorem .inc",
            }}
            question={{
              questonSlug:
                question.slug || "mengapa-react-js-sangat-popular-637353",
              content: question.content || "Mengapa React JS sangat populer?",
              categories: question.questionCategories.map((category) => ({
                categoryId: category.category.categoryId,
                name: category.category.name,
              })),
            }}
            createdAt={question.createdAt.toString() || "2023-10-01T12:00:00Z"}
            hasAccessToModify={session?.user.id == question.user.id}
          />
        </li>
      ))}
      <InfiniteScroll
        fetchNextPage={query.fetchNextPage}
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
      />
    </ul>
  );
};
