import Link from "next/link";
import { FaPlus, FaSearch } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { UserButton } from "@/modules/auth/ui/components/UserButton";
import { ApplicationLogoWithBrand } from "@/components/ApplicationLogo";

export const MainNavbar = () => {
  return (
    <header className="sticky top-0 z-50 h-16 w-full border-b bg-sidebar px-2 xl:px-0">
      <div className="mx-auto flex h-full max-w-screen-xl items-center justify-between">
        <div className="flex items-center">
          <ApplicationLogoWithBrand />
        </div>
        <div>
          <nav className="flex items-center space-x-4">
            {/* Search button in mobile screen */}
            <div className="cursor-pointer hover:text-muted-foreground md:hidden">
              <FaSearch className="size-6" />
            </div>
            {/* Search button in dekstop screen */}
            <div className="hidden h-10 w-[255px] cursor-pointer rounded-full border transition-all duration-200 ease-in-out hover:bg-muted/50 md:block">
              <div className="flex h-full items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground">
                <FaSearch />
                <span>Cari di Forumdiskusi..</span>
              </div>
            </div>

            <Button variant="default" asChild>
              <Link href="/questions/ask">
                <div className="flex items-center gap-2">
                  <span className="hidden md:block">Tanyakan sesuatu</span>
                  <FaPlus />
                </div>
              </Link>
            </Button>

            <UserButton />
          </nav>
        </div>
      </div>
    </header>
  );
};
