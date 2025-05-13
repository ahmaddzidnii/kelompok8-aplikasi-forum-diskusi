import { QuestionCard } from "@/modules/questions/ui/components/QuestionCard";

export const ThreadsListSection = () => {
  return (
    <ul>
      {Array.from({ length: 5 }, (_, index) => (
        <li key={index} className="mb-4">
          <QuestionCard
            author={{
              username: "ahmaddzidnii",
              name: "Ahmad Zidni Hidayat",
              avatar: "/avatar.png",
              organization: "Web Developer at Lorem .inc",
            }}
            question={{
              questonSlug: "mengapa-react-js-sangat-popular-637353",
              content: "Mengapa React JS sangat populer?",
            }}
            createdAt={"2023-10-01T12:00:00Z"}
          />
        </li>
      ))}
    </ul>
  );
};
