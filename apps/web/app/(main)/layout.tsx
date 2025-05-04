import { MainLayout } from "@/modules/core/ui/layouts/MainLayout";

interface HomeLayoutProps {
  children: React.ReactNode;
}

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return <MainLayout>{children}</MainLayout>;
};

export default HomeLayout;
