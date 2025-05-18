import { HydrateClient, trpc } from "@/trpc/server";
import { QuestionDetail } from "@/modules/questions/ui/views/QuestionDetail";
import { config } from "@/config";

interface QuestionDetailPageProps {
  params: {
    threadsSlug: string;
  };
  searchParams: {
    answerSort: "asc" | "desc" | "recommended";
  };
}

export const dynamic = "force-dynamic";

const QuestionDetailPage = ({
  params,
  searchParams,
}: QuestionDetailPageProps) => {
  const answerSort = searchParams.answerSort;
  void trpc.answers.getMany.prefetchInfinite({
    questionSlug: params.threadsSlug,
    limit: config.answers.defaultLimit,
    sort: answerSort ? answerSort : "recommended",
  });
  return (
    <HydrateClient>
      <QuestionDetail threadSlug={params.threadsSlug} />
    </HydrateClient>
  );
};

export default QuestionDetailPage;
