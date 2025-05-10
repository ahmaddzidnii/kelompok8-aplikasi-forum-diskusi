import { QuestionCard } from "@/modules/threads/ui/components/QuestionCard";

export const QuestionsList = () => {
  return (
    <ul>
      {Array.from({ length: 10 }, (_, i) => (
        <li key={i} className="mb-4">
          <QuestionCard
            question={{
              content: "Apa itu Next.js?",
              questonSlug: "apa-itu-nextjs-7864",
            }}
            author={{
              name: "Ahmad Zidni Hidayat",
              avatar: "/avatar.png",
              username: "ahmadzidni",
              bio: "Web Developer at XYZ",
            }}
            createdAt="2 menit yang lalu"
          />
        </li>
      ))}
    </ul>
  );
};
