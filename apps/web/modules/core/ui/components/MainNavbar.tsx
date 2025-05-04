import { FaBars, FaPlus, FaSearch } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { ApplicationLogoWithBrand } from "@/components/ApplicationLogo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TooltipWrapper } from "@/components/TooltipWrapper";

export const MainNavbar = () => {
  return (
    <header className="sticky top-0 z-50 h-16 w-full border-b bg-sidebar">
      <div className="mx-auto flex h-full max-w-screen-xl items-center justify-between">
        <div className="flex items-center">
          <FaBars className="mr-4 size-6 cursor-pointer md:hidden" />
          <ApplicationLogoWithBrand />
        </div>
        <div>
          <nav className="flex items-center space-x-4">
            {/* Search button in mobile screen */}
            <div className="cursor-pointer hover:text-muted-foreground md:hidden">
              <TooltipWrapper content="Cari di Forumdiskusi..">
                <FaSearch className="size-6" />
              </TooltipWrapper>
            </div>
            {/* Search button in dekstop screen */}
            <div className="hidden h-10 w-[255px] cursor-pointer rounded-full border transition-all duration-200 ease-in-out hover:bg-muted/50 md:block">
              <div className="flex h-full items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground">
                <FaSearch />
                <span>Cari di Forumdiskusi..</span>
              </div>
            </div>
            <TooltipWrapper content="Buat Diskusi Baru">
              <Button variant="default">
                <span className="hidden md:block">Tanayakan sesuatu</span>
                <FaPlus />
              </Button>
            </TooltipWrapper>
            <Avatar>
              <AvatarImage src="/avatar.png" />
              <AvatarFallback></AvatarFallback>
            </Avatar>
          </nav>
        </div>
      </div>
    </header>
  );
};
