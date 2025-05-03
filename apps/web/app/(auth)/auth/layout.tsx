import { AuthLayout } from "@/modules/auth/ui/layouts/AuthLayout";

interface LayoutProps {
  children: React.ReactNode;
}

const layout = ({ children }: LayoutProps) => {
  return <AuthLayout>{children}</AuthLayout>;
};

export default layout;
