import React from "react";

import { HydrateClient, trpc } from "@/trpc/server";
import { UserAnswersView } from "@/modules/user-profile/ui/views/UserAnswersView";

interface UserAnswersPageProps {
  params: {
    userId: string;
  };
}

const AnswersPage = ({ params }: UserAnswersPageProps) => {
  const username = decodeURIComponent(params.userId).replace("@", "");

  void trpc.users.getAnswersByUsername.prefetchInfinite({
    username,
  });

  return (
    <HydrateClient>
      <UserAnswersView username={username} />
    </HydrateClient>
  );
};

export default AnswersPage;
