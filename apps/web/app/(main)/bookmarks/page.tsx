import { HydrateClient } from "@/trpc/server";

import { BookmarkView } from "@/modules/bookmarks/ui/views/BookmarkView";

export const metadata = {
  title: "Jawaban Tersimpan",
  description: "Simpan jawaban yang anda suka",
};

const BookmarkPage = () => {
  // TODO: prefetch data bookmark
  return (
    <HydrateClient>
      <BookmarkView />
    </HydrateClient>
  );
};

export default BookmarkPage;
