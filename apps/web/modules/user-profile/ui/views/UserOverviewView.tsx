"use client";

import Link from "next/link";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { Loader } from "@/components/Loader";
import { InternalServerError } from "@/components/InternalServerErrorFallback";
import { trpc } from "@/trpc/client";
import Truncate from "@/components/Truncate";
import { transformJsonToHtml } from "@/lib/transform-json-to-html";
import { EmptyState } from "@/components/EmptyState";

interface UserOverviewProps {
  username: string;
}

export const UserOverview = ({ username }: UserOverviewProps) => {
  return (
    <Suspense fallback={<Loader />}>
      <ErrorBoundary fallback={<InternalServerError />}>
        <UserOverviewSuspense username={username} />
      </ErrorBoundary>
    </Suspense>
  );
};

const UserOverviewSuspense = ({ username }: UserOverviewProps) => {
  const [data] = trpc.users.getDataOverview.useSuspenseQuery({
    username,
  });

  return (
    <div className="w-full space-y-5">
      <div className="w-full space-y-3">
        <div>
          <p className="mb-2 text-base">Pertanyaan terakhir yang diajukan</p>
          {data.recentQuestions.length > 0 ? (
            <ul className="grid grid-cols-1 gap-x-2 lg:grid-cols-2">
              {data.recentQuestions.map((question, index) => (
                <li
                  key={index}
                  className="mb-3 min-h-20 w-full overflow-hidden rounded-md border p-2"
                >
                  <Link
                    href={`/questions/${question.slug}`}
                    className="line-clamp-3 break-words font-bold hover:underline"
                  >
                    {question.content || "Pertanyaan tanpa judul"}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState />
          )}
        </div>

        <div>
          <p className="mb-2 text-base">Pertanyaan terakhir yang dijawab</p>
          {data.recentAnswers.length > 0 ? (
            <ul className="grid grid-cols-1 gap-x-2 lg:grid-cols-2">
              {data.recentAnswers.map((answer, index) => (
                <li key={index} className="mb-3 w-full rounded-md border p-4">
                  <Link
                    href={`/questions/${answer.question.slug}`}
                    className="mb-2 line-clamp-3 font-bold hover:underline"
                  >
                    {answer.question.content || "Pertanyaan tanpa judul"}
                  </Link>

                  <Truncate
                    typeExpand="link"
                    linkHref={`/questions/${answer.question.slug}`}
                    maxHeight={80}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: transformJsonToHtml(answer.content || ""),
                      }}
                    ></div>
                  </Truncate>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
};
