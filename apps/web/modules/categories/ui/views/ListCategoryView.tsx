"use client";

import { Suspense } from "react";
import Link from "next/link";
import { MdCategory } from "react-icons/md";
import { ErrorBoundary } from "react-error-boundary";
import { FaClipboardQuestion } from "react-icons/fa6";

import { Card } from "@/components/ui/card";
import { InternalServerError } from "@/components/InternalServerErrorFallback";
import { Loader } from "@/components/Loader";
import { trpc } from "@/trpc/client";

export const ListCategoryView = () => {
  return (
    <Suspense fallback={<Loader />}>
      <ErrorBoundary fallback={<InternalServerError />}>
        <ListCategoryViewSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const ListCategoryViewSuspense = () => {
  const [categories] = trpc.categories.getMany.useSuspenseQuery();
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <Link
          href={`/?categoryId=${category.categoryId}`}
          key={category.categoryId}
          className="block"
        >
          <Card className="h-full overflow-hidden hover:shadow-lg">
            <div className="flex h-full flex-col">
              <div
                className={`bg-gradient-to-r from-cyan-500 to-blue-500 p-4 text-white`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MdCategory />
                    <h3 className="font-semibold">{category.name}</h3>
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-between p-4">
                <p className="mb-4 text-sm text-muted-foreground">
                  {category.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm">
                    <FaClipboardQuestion className="h-4 w-4 text-muted-foreground" />
                    <span>{category._count.question} pertanyaan</span>
                  </div>
                  {category.recentQuestionAuthors.length > 0 && (
                    <div className="flex items-center gap-1 text-sm">
                      <div className="flex -space-x-2 rounded-full p-1">
                        {category.recentQuestionAuthors.map((author, index) => (
                          <img
                            key={author.id}
                            src={author.image || "/avatar.png"}
                            alt={author.name || "User"}
                            className="relative size-7 rounded-full border-2 border-white shadow-sm transition-all hover:z-10 hover:scale-110 hover:shadow-md"
                            style={{
                              zIndex:
                                category.recentQuestionAuthors.length - index,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};
