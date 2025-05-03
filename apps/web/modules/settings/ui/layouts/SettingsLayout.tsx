import { Footer } from "@/components/Footer";
import "@/modules/user-profile/ui/styles/profile.css";

import SettingsSidebar from "../components/SettingsSidebar";
import { Navbar } from "@/components/Navbar";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export const SettingsLayout = ({ children }: SettingsLayoutProps) => {
  return (
    <>
      <Navbar title="Pengaturan" hrefTitle="/settings/profile" />
      <div className="mx-auto w-full max-w-[1216px] px-2 pt-5">
        <div className="Layout Layout--flowRow-until-md min-h-screen">
          <aside className="Layout-sidebar w-full shrink-0 select-none">
            <SettingsSidebar />
          </aside>
          <div className="Layout-main pt-4">{children}</div>
        </div>
      </div>
      <Footer />
    </>
  );
};
