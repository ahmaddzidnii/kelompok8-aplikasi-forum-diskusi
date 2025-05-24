import { ListCategoryView } from "@/modules/categories/ui/views/ListCategoryView";
import { HydrateClient, trpc } from "@/trpc/server";

export const metadata = {
  title: "Kategori",
  description: "Daftar kategori yang tersedia",
};

export const dynamic = "force-dynamic";

const AnswerPage = () => {
  void trpc.categories.getMany.prefetch();
  return (
    <HydrateClient>
      <ListCategoryView />
    </HydrateClient>
  );
};

export default AnswerPage;
