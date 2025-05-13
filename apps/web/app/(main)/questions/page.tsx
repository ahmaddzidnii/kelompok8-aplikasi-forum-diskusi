import { config } from "@/config";
import { HydrateClient, trpc } from "@/trpc/server";
import { QuestionsView } from "@/modules/questions/ui/views/QuestionsView";

export const metadata = {
  title: "Daftar Pertanyaan yang Diajukan",
};

export const dynamic = "force-dynamic";

const QuestionsPage = () => {
  void trpc.questions.getMany.prefetchInfinite({
    limit: config.questions.defaultLimit,
  });
  return (
    <HydrateClient>
      <QuestionsView />
    </HydrateClient>
  );
};

export default QuestionsPage;
