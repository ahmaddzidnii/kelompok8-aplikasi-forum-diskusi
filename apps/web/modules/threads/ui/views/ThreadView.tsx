import { FaChevronDown } from "react-icons/fa";

import { Button } from "@/components/ui/button";

import { QuestionCard } from "../components/QuestionCard";
import { ListsAnswerSection } from "../section/ListsAnswerSection";

interface ThreadViewProps {
  threadSlug?: string;
}

export const ThreadView = ({ threadSlug }: ThreadViewProps) => {
  console.log({ threadSlug }, "ThreadViewComponent");
  return (
    <div className="space-y-4">
      <QuestionCard
        author={{
          username: "ahmaddzidnii",
          name: "Ahmad Zidni Hidayat",
          avatar: "/avatar.png",
          bio: "Web Developer at Lorem .inc",
        }}
        question={{
          questonSlug: "/threads/mengapa-react-js-sangat-popular-637353",
          content: "Mengapa React JS sangat populer?",
        }}
        createdAt="2 hari yang lalu"
        withButton={false}
      />

      <div className="flex w-full items-center justify-between">
        <h1 className="text-base font-semibold">Jawaban :</h1>
        <Button variant="outline">
          <span className="text-[14px]">Disarankan</span>
          <FaChevronDown className="ml-2" />
        </Button>
      </div>

      <ListsAnswerSection />
    </div>
  );
};
