import { BookmarkList } from "../components/BookmarkList";

export const BookmarkView = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Jawaban Tersimpan</h1>
      <BookmarkList />
    </div>
  );
};
