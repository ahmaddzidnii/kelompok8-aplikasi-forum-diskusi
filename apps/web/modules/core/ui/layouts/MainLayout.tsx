import { Footer } from "@/components/Footer";
import { MainNavbar } from "../components/MainNavbar";
import { MainSidebar } from "../components/MainSidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}
export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="px-2 xl:px-0">
      <MainNavbar />
      <div className="mx-auto grid min-h-screen max-w-screen-xl grid-cols-[0px_minmax(0,_1fr)] pt-[calc(64px+8px)] md:grid-cols-[210px_24px_minmax(0,_1fr)] lg:grid-cols-[240px_28px_minmax(0,_1fr)]">
        <MainSidebar />
        &nbsp;
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  );
};
