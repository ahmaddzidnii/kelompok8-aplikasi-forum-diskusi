import { BookmarkCard } from "./BookmarkCard";

export const BookmarkList = () => {
  return (
    <ul>
      {Array.from({ length: 5 }, (_, i) => (
        <li key={i} className="mb-4">
          <BookmarkCard
            answerContent="React JS sangat populer karena memiliki ekosistem yang besar dan komunitas yang aktif. Selain itu, React JS juga memiliki performa yang baik dan mudah untuk dipelajari."
            author={{
              username: "ahmaddzidnii",
              name: "Jawed Karim",
              avatar: "/avatar.png",
              bio: "Founder at youtube .inc",
            }}
            createdAt="2 hari yang lalu"
            question={{
              questonSlug: "/threads/mengapa-react-js-sangat-popular-637353",
              content: "Mengapa React JS sangat populer?",
            }}
          />
        </li>
      ))}
    </ul>
  );
};
