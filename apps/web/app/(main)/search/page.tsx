import { SearchView } from "@/modules/search/ui/views/SearchView";
import { HydrateClient, trpc } from "@/trpc/server";

interface SearchPageProps {
  searchParams: { q?: string; type?: "questions" | "users" };
}

const SearchPage = ({ searchParams }: SearchPageProps) => {
  const query = searchParams.q || "";
  const activeTab = searchParams.type || "questions";

  void trpc.search.getResultsCount({
    q: query,
  });

  void trpc.search.getSearchResults({
    q: query,
    type: activeTab,
  });

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-gray-500">
          <h2 className="mb-4 text-2xl font-semibold">Pencarian</h2>
          <p>Masukkan kata kunci untuk mencari pertanyaan atau pengguna</p>
        </div>
      </div>
    );
  }

  return (
    <HydrateClient>
      <SearchView />
    </HydrateClient>
  );
};

export default SearchPage;
