"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import { Loader } from "@/components/Loader";
import { EmptyState } from "@/components/EmptyState";
import { InfiniteScroll } from "@/components/InfiniteScroll";
import { AnswerCard } from "@/modules/questions/ui/components/AnswerCard";
import { CommentProvider } from "@/modules/comments/context/CommentContext";
import { InternalServerError } from "@/components/InternalServerErrorFallback";
import { config } from "@/config";

interface ListsAnswerSectionProps {
  questionSlug: string;
}

export const ListsAnswerSection = ({
  questionSlug,
}: ListsAnswerSectionProps) => {
  return (
    <Suspense fallback={<Loader />}>
      <ErrorBoundary fallback={<InternalServerError />}>
        <ListsAnswerSectionSuspense questionSlug={questionSlug} />
      </ErrorBoundary>
    </Suspense>
  );
};

const ListsAnswerSectionSuspense = ({
  questionSlug,
}: ListsAnswerSectionProps) => {
  const answerSort = useSearchParams().get("answerSort") as
    | "asc"
    | "desc"
    | "recommended";

  const [data, query] = trpc.answers.getMany.useSuspenseInfiniteQuery(
    {
      questionSlug,
      limit: config.answers.defaultLimit,
      sort: answerSort ? answerSort : "recommended",
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const answers = data.pages.flatMap((page) => page.items);

  if (answers.length === 0) {
    return <EmptyState />;
  }
  return (
    <ul className="space-y-4">
      {answers.map((answer, idx) => (
        <li key={answer.answerId + idx}>
          <CommentProvider>
            <AnswerCard
              answerId={answer.answerId}
              answerContent={answer.content}
              author={{
                username: answer.user.username as string,
                name: answer.user.name as string,
                avatar: answer.user.image as string,
                bio: answer.user.organization as string,
              }}
              createdAt={answer.createdAt.toString()}
              count={{
                upVote: answer._count.upvotesAnswer,
                comment: answer._count.comments,
                isBookmarked: answer.isBookmarked,
              }}
              isAlreadyUpvoted={answer.isAlreadyUpvoted}
              answerSort={answerSort ? answerSort : "recommended"}
              questionSlug={questionSlug}
              usersVoteUp={answer.usersVoteUp}
            />
          </CommentProvider>
        </li>
      ))}

      <InfiniteScroll
        fetchNextPage={query.fetchNextPage}
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        isManual
      />
    </ul>
  );
};
