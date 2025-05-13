import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { config } from "@/config";
import { withAuthServerSide } from "@/modules/auth/function/withAuthServerSide";

interface BookmarkPageGuardProps {
  children: React.ReactNode;
}

const BookmarkLayout = async ({ children }: BookmarkPageGuardProps) => {
  const session = await auth();

  if (!session?.user) {
    redirect(config.loginRoute);
  }
  return <>{children}</>;
};

export default withAuthServerSide(BookmarkLayout);
