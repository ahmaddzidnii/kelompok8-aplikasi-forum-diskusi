import { HydrateClient, trpc } from "@/trpc/server";

import { BookmarkView } from "@/modules/bookmarks/ui/views/BookmarkView";
import { config } from "@/config";

export const metadata = {
  title: "Jawaban Tersimpan",
  description: "Simpan jawaban yang anda suka",
};

export const dynamic = "force-dynamic";

const BookmarkPage = () => {
  void trpc.bookmark.getBookmarks.prefetchInfinite({
    limit: config.bookmarks.defaultLimit,
  });
  return (
    <HydrateClient>
      <BookmarkView />
    </HydrateClient>
  );
};

export default BookmarkPage;
