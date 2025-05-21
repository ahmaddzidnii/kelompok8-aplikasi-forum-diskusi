"use client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { config } from "@/config";
import { trpc } from "@/trpc/client";
import { Loader } from "@/components/Loader";
import { BookmarkCard } from "./BookmarkCard";
import { EmptyState } from "@/components/EmptyState";
import { InfiniteScroll } from "@/components/InfiniteScroll";
import { InternalServerError } from "@/components/InternalServerErrorFallback";

export const BookmarkList = () => {
  return (
    <Suspense fallback={<Loader />}>
      <ErrorBoundary fallback={<InternalServerError />}>
        <BookmarkListSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const BookmarkListSuspense = () => {
  const [data, query] = trpc.bookmark.getBookmarks.useSuspenseInfiniteQuery(
    {
      limit: config.bookmarks.defaultLimit,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const bookmarks = data.pages.flatMap((page) => page.items);

  if (bookmarks.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {bookmarks.map((bookmark, i) => (
        <li key={i} className="mb-4">
          <BookmarkCard
            answerContent={bookmark.answer.content}
            answerId={bookmark.answer.answerId}
            author={{
              username: bookmark.answer.user.username || "ahmaddzidnii",
              name: bookmark.answer.user.name || "Ahmad Dzidnii",
              avatar: bookmark.answer.user.image || "",
              bio: bookmark.answer.user.organization || "PT. XYZ",
            }}
            createdAt={bookmark.answer.createdAt.toString()}
            question={{
              content: bookmark.answer.question.content,
              questonSlug: bookmark.answer.question.slug,
            }}
          />
        </li>
      ))}
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        fetchNextPage={query.fetchNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        isManual
      />
    </ul>
  );
};
