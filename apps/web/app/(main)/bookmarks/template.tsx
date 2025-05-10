import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { config } from "@/config";

interface BookmarkPageGuardProps {
  children: React.ReactNode;
}

const BookmarkPageGuard = async ({ children }: BookmarkPageGuardProps) => {
  const session = await auth();

  if (!session?.user) {
    redirect(config.loginRoute);
  }
  return <>{children}</>;
};

export default BookmarkPageGuard;
