import { HydrateClient } from "@/trpc/server";
import { ThreadView } from "@/modules/threads/ui/views/ThreadView";

interface ThreadsDetailProps {
  params: {
    threadsSlug: string;
  };
}

const ThreadsDetail = ({ params }: ThreadsDetailProps) => {
  // TODO: prefetch thread detail data
  return (
    <HydrateClient>
      <ThreadView threadSlug={params.threadsSlug} />
    </HydrateClient>
  );
};

export default ThreadsDetail;
