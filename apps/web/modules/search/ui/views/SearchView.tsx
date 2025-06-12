"use client";

import { InternalServerError } from "@/components/InternalServerErrorFallback";
import { Loader } from "@/components/Loader";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useQueryStates, parseAsString } from "nuqs";
import { trpc } from "@/trpc/client";
import Link from "next/link";
import { QuestionCard } from "@/modules/questions/ui/components/QuestionCard";

export const SearchView = () => {
  return (
    <Suspense fallback={<Loader />}>
      <ErrorBoundary fallback={<InternalServerError />}>
        <SearchViewSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const useSearchFilters = () => {
  return useQueryStates({
    q: parseAsString.withDefault(""),
    type: parseAsString.withDefault("questions").withOptions({
      clearOnDefault: false,
    }),
  });
};

const SearchViewSuspense = () => {
  const [filters, setFilters] = useSearchFilters();
  const [count] = trpc.search.getResultsCount.useSuspenseQuery({
    q: filters.q,
  });

  const [searchResults] = trpc.search.getSearchResults.useSuspenseQuery({
    q: filters.q,
    type: filters.type as any,
  });

  const query = filters.q;
  const activeTab = filters.type;

  const handleTabChange = (tab: "questions" | "users") => {
    setFilters({ type: tab });
  };

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-500">
          <h2 className="mb-4 text-2xl font-semibold">Pencarian</h2>
          <p>Masukkan kata kunci untuk mencari pertanyaan atau pengguna</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold">
          Hasil pencarian untuk "{query}"
        </h1>
        <p className="text-gray-600">
          Ditemukan {count.questions} pertanyaan dan {count.users} pengguna
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => handleTabChange("questions")}
            className={`border-b-2 px-1 py-2 text-sm font-medium ${
              activeTab === "questions"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            Pertanyaan ({count.questions})
          </button>
          <button
            onClick={() => handleTabChange("users")}
            className={`border-b-2 px-1 py-2 text-sm font-medium ${
              activeTab === "users"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            Pengguna ({count.users})
          </button>
        </nav>
      </div>

      {/* Content */}
      <Suspense fallback={<div>Loading...</div>}>
        {activeTab === "questions" ? (
          <div className="space-y-4">
            {searchResults.questions.length > 0 ? (
              searchResults.questions.map((question) => (
                <QuestionCard
                  key={question.questionId}
                  author={{
                    username: question.user.username || "",
                    name: question.user.name || "",
                    avatar: question.user.image || "/default-avatar.png",
                    organization: question.user.organization || "",
                  }}
                  createdAt={question.createdAt.toISOString()}
                  question={{
                    content: question.content,
                    questonSlug: question.slug,
                    categories: question.questionCategories.map((cat) => ({
                      categoryId: cat.category.categoryId,
                      name: cat.category.name,
                    })),
                  }}
                  withButton={true}
                  hasAccessToModify={false}
                />
              ))
            ) : (
              <div className="py-8 text-center text-gray-500">
                <p>Tidak ada pertanyaan yang ditemukan untuk "{query}"</p>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Pengguna Ditemukan</h3>
            {searchResults.users.length > 0 ? (
              <div className="space-y-3">
                {searchResults.users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100"
                  >
                    <img
                      src={user.image || "/default-avatar.png"}
                      alt={user.name || "User Avatar"}
                      className="h-8 w-8 rounded-full"
                    />
                    <div>
                      <Link
                        href={`/@${user.username}`}
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        {user.name}
                      </Link>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-gray-500">
                <p>Tidak ada pengguna yang ditemukan untuk "{query}"</p>
              </div>
            )}
          </div>
        )}
      </Suspense>
    </div>
  );
};
