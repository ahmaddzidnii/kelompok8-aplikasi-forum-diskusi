import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AuthLayout } from "@/modules/auth/ui/layouts/AuthLayout";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  const session = await auth();
  if (session) {
    redirect("/");
  }
  return <AuthLayout>{children}</AuthLayout>;
};

export default Layout;
