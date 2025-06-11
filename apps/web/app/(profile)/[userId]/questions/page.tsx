import { UserQuestionView } from "@/modules/user-profile/ui/views/UserQuestionsView";
import { HydrateClient, trpc } from "@/trpc/server";

interface PageProps {
  params: {
    userId: string;
  };
}

const AnswersPage = ({ params }: PageProps) => {
  void trpc.users.getQuestionsByUsername.prefetchInfinite({
    username: decodeURIComponent(params.userId).replace("@", ""),
  });
  return (
    <HydrateClient>
      <UserQuestionView
        username={decodeURIComponent(params.userId).replace("@", "")}
      />
    </HydrateClient>
  );
};

export default AnswersPage;
