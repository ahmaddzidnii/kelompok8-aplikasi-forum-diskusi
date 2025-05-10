import { HydrateClient, trpc } from "@/trpc/server";
import { AskQuestionView } from "@/modules/asks/ui/views/AskQuestionView";

export const metadata = {
  title: "Tanyakan sesuatu",
  description: "Tanya jawab seputar teknologi, bisnis, dan keuangan",
};

export const dynamic = "force-dynamic";

const CreateAskPage = () => {
  void trpc.categories.getMany.prefetch();
  return (
    <HydrateClient>
      <AskQuestionView />
    </HydrateClient>
  );
};

export default CreateAskPage;
