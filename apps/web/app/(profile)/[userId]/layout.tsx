import { Metadata } from "next";

import { trpc } from "@/trpc/server";
import { UserProfileLayout } from "@/modules/user-profile/ui/layouts/UserProfileLayout";

interface LayoutProps {
  children: React.ReactNode;
  params: {
    userId: string;
  };
}

export async function generateMetadata({
  params,
}: {
  params: { userId: string };
}): Promise<Metadata> {
  const { title } = await trpc.users.getTitleByUsername({
    username: decodeURIComponent(params.userId).replace("@", ""),
  });
  return {
    title,
  };
}

const Layout = ({ children, params }: LayoutProps) => {
  return (
    <UserProfileLayout
      username={decodeURIComponent(params.userId).replace("@", "")}
    >
      {children}
    </UserProfileLayout>
  );
};

export default Layout;
