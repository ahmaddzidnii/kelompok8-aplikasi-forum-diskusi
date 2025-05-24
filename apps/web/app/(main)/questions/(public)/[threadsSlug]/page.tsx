import { HydrateClient, trpc } from "@/trpc/server";
import { QuestionDetail } from "@/modules/questions/ui/views/QuestionDetail";
import { config } from "@/config";
import { Metadata } from "next";

interface QuestionDetailPageProps {
  params: {
    threadsSlug: string;
  };
  searchParams: {
    answerSort: "asc" | "desc" | "recommended";
  };
}

export async function generateMetadata({
  params,
}: QuestionDetailPageProps): Promise<Metadata> {
  const slug = params.threadsSlug;

  const pageTitle = await trpc.questions.getPageTitle({
    slug,
  });

  return {
    title: pageTitle,
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
