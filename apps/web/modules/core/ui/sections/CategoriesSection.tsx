"use client";

import { Suspense } from "react";
import { useRouter } from "nextjs-toploader/app";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import { FilterCarousel } from "@/components/FilterCarousel";
import { TriangleAlertIcon } from "lucide-react";

interface CategoriesSectionProps {
  categoryId?: string;
}

export const CategoriesSection = ({ categoryId }: CategoriesSectionProps) => {
  return (
    <Suspense
      fallback={<FilterCarousel isLoading data={[]} onSelect={() => {}} />}
    >
      <ErrorBoundary
        fallback={
          <div className="mx-auto flex items-center text-red-500">
            <TriangleAlertIcon className="mr-3" /> Terjadi kegagalan saat memuat
            category!
          </div>
        }
      >
        <CategoriesSectionSuspense categoryId={categoryId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const CategoriesSectionSuspense = ({ categoryId }: CategoriesSectionProps) => {
  const [categories] = trpc.categories.getMany.useSuspenseQuery();

  const data = categories.map((category) => ({
    value: category.categoryId,
    label: category.name,
  }));

  const router = useRouter();

  const onSelect = (value: string | null) => {
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set("categoryId", value);
    } else {
      url.searchParams.delete("categoryId");
    }

    router.push(url.toString());
  };
  return (
    <div className="sticky top-[64px] z-50 bg-background py-2">
      <FilterCarousel onSelect={onSelect} value={categoryId} data={data} />
    </div>
  );
};
