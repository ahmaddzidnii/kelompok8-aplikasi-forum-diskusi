import { HydrateClient, trpc } from "@/trpc/server";
import { QuestionDetail } from "@/modules/questions/ui/views/QuestionDetail";
import { config } from "@/config";

interface QuestionDetailPageProps {
  params: {
    threadsSlug: string;
  };
}

export const dynamic = "force-dynamic";

const QuestionDetailPage = ({ params }: QuestionDetailPageProps) => {
  void trpc.answers.getMany.prefetchInfinite({
    questionSlug: params.threadsSlug,
    limit: config.answers.defaultLimit,
  });
  return (
    <HydrateClient>
      <QuestionDetail threadSlug={params.threadsSlug} />
    </HydrateClient>
  );
};

export default QuestionDetailPage;
