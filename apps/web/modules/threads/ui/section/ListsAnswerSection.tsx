import { AnswerCard } from "../components/AnswerCard";

export const ListsAnswerSection = () => {
  return (
    <ul>
      <li>
        <AnswerCard
          answerContent="React JS sangat populer karena memiliki ekosistem yang besar dan komunitas yang aktif. Selain itu, React JS juga memiliki performa yang baik dan mudah untuk dipelajari."
          author={{
            username: "ahmaddzidnii",
            name: "Jawed Karim",
            avatar: "/avatar.png",
            bio: "Founder at youtube .inc",
          }}
          createdAt="2 hari yang lalu"
          count={{
            upVote: 10,
            comment: 5,
          }}
        />
      </li>
    </ul>
  );
};
