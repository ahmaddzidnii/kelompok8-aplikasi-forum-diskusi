import { SettingsLayout } from "@/modules/settings/ui/layouts/SettingsLayout";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return <SettingsLayout>{children}</SettingsLayout>;
};

export default Layout;
