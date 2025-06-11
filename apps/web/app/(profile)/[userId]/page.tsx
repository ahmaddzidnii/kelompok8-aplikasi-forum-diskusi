import { HydrateClient, trpc } from "@/trpc/server";
import { UserOverview } from "@/modules/user-profile/ui/views/UserOverviewView";

interface PageProps {
  params: {
    userId: string;
  };
}

const Page = ({ params }: PageProps) => {
  const username = decodeURIComponent(params.userId).replace("@", "");
  void trpc.users.getDataOverview.prefetch({
    username,
  });
  return (
    <HydrateClient>
      <UserOverview username={username} />
    </HydrateClient>
  );
};

export default Page;
