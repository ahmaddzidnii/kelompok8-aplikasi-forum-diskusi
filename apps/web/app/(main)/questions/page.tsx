import { QuestionsView } from "@/modules/questions/ui/views/QuestionsView";
import { HydrateClient } from "@/trpc/server";

const QuestionsPage = () => {
  return (
    <HydrateClient>
      <QuestionsView />
    </HydrateClient>
  );
};

export default QuestionsPage;
