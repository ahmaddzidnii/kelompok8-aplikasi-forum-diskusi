import { Footer } from "@/components/Footer";
import { MainNavbar } from "../components/MainNavbar";
import { MainSidebar, MobileSidebar } from "../components/MainSidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}
export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div>
      <MainNavbar />
      <MobileSidebar />
      <div className="mx-auto grid min-h-screen max-w-screen-xl grid-cols-[0px_minmax(0,_1fr)] px-2 md:grid-cols-[210px_24px_minmax(0,_1fr)] lg:grid-cols-[240px_28px_minmax(0,_1fr)] xl:px-0">
        <MainSidebar />
        &nbsp;
        <main className="pt-2">{children}</main>
      </div>
      <Footer />
    </div>
  );
};
