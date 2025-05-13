"use client";

import { AnswerCard } from "@/modules/questions/ui/components/AnswerCard";
import { CommentProvider } from "@/modules/comments/context/CommentContext";

export const ListsAnswerSection = () => {
  return (
    <ul className="space-y-4">
      <li>
        <CommentProvider>
          <AnswerCard
            answerContent="React JS sangat populer karena memiliki ekosistem yang besar dan komunitas yang aktif. Selain itu, React JS juga memiliki performa yang baik dan mudah untuk dipelajari."
            author={{
              username: "ahmaddzidnii",
              name: "Jawed Karim",
              avatar: "/avatar.png",
              bio: "Founder at youtube .inc",
            }}
            createdAt="2023-10-01T12:00:00Z"
            count={{
              upVote: 10,
              comment: 5,
            }}
          />
        </CommentProvider>
      </li>
      <li>
        <CommentProvider>
          <AnswerCard
            answerContent="React JS sangat populer karena memiliki ekosistem yang besar dan komunitas yang aktif. Selain itu, React JS juga memiliki performa yang baik dan mudah untuk dipelajari."
            author={{
              username: "ahmaddzidnii",
              name: "Jawed Karim",
              avatar: "/avatar.png",
              bio: "Founder at youtube .inc",
            }}
            createdAt="2023-10-01T12:00:00Z"
            count={{
              upVote: 10,
              comment: 5,
            }}
          />
        </CommentProvider>
      </li>
    </ul>
  );
};
