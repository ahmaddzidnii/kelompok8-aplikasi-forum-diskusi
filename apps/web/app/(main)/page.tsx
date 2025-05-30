import { MainView } from "@/modules/core/ui/views/MainView";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface HomePageProps {
  searchParams: {
    categoryId?: string;
  };
}

const HomePage = ({ searchParams }: HomePageProps) => {
  void trpc.categories.getMany.prefetch();
  void trpc.questions.getRecommended.prefetchInfinite({
    categoryId: searchParams.categoryId,
  });
  return (
    <HydrateClient>
      <MainView categoryId={searchParams.categoryId} />
    </HydrateClient>
  );
};

export default HomePage;
