import { HydrateClient, trpc } from "@/trpc/server";
// import { ForumView } from "@/modules/forums/ui/views/ForumView";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: {
    categoryId?: string;
  };
}

const Page = ({ searchParams }: PageProps) => {
  console.log("searchParams", searchParams);
  void trpc.categories.getMany.prefetch();
  return (
    <HydrateClient>
      {/* <ForumView categoryId={searchParams.categoryId} /> */}
      <div>Hello world</div>
    </HydrateClient>
  );
};

export default Page;
