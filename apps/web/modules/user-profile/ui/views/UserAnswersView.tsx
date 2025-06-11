"use client";

import Link from "next/link";
import { Suspense } from "react";
import { id } from "date-fns/locale";
import { formatDistanceToNow } from "date-fns";
import { ErrorBoundary } from "react-error-boundary";

import { Loader } from "@/components/Loader";
import { InternalServerError } from "@/components/InternalServerErrorFallback";
import { trpc } from "@/trpc/client";
import { EmptyState } from "@/components/EmptyState";
import { InfiniteScroll } from "@/components/InfiniteScroll";
import { AvatarComponent } from "@/components/AvatarComponent";
import { TruncatedContent } from "@/modules/questions/ui/components/TruncatedContent";

interface UserAnswersViewProps {
  username: string;
}

export const UserAnswersView = ({ username }: UserAnswersViewProps) => {
  return (
    <Suspense fallback={<Loader />}>
      <ErrorBoundary fallback={<InternalServerError />}>
        <UserAnswersViewsSuspense username={username} />
      </ErrorBoundary>
    </Suspense>
  );
};

const UserAnswersViewsSuspense = ({ username }: UserAnswersViewProps) => {
  const [answers, query] =
    trpc.users.getAnswersByUsername.useSuspenseInfiniteQuery(
      {
        username,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const answerLists = answers.pages.flatMap((page) => page.items);

  if (answerLists.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul className="flex flex-col gap-3">
      {answerLists.map((answer, index) => (
        <li
          key={index}
          className="flex flex-col gap-3 rounded-lg bg-card px-2.5 py-3"
        >
          <div className="flex">
            <AvatarComponent
              alt={answer.user.name || "default"}
              src={answer.user.image || "/profile.jpg"}
            />

            <div className="ml-2 flex flex-col justify-center">
              <p className="text-sm font-bold">{answer.user.name}</p>
              <p className="text-xs text-muted-foreground">
                {" "}
                {formatDistanceToNow(answer.createdAt, {
                  addSuffix: true,
                  locale: id,
                  includeSeconds: true,
                }).replace(/^\s*\D*?(\d+.*)/, "$1")}
              </p>
            </div>
          </div>
          <div>
            <Link
              href={`/questions/${answer.question.slug}`}
              className="mb-2 line-clamp-2 font-bold hover:underline"
            >
              {answer.question.content || "Pertanyaan ini tidak memiliki judul"}
            </Link>

            <TruncatedContent content={answer.content} />
          </div>
        </li>
      ))}
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
        isManual
      />
    </ul>
  );
};
