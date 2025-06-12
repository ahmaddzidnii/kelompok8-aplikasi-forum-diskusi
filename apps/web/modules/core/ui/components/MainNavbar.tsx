import Link from "next/link";
import { FaPlus } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { UserButton } from "@/modules/auth/ui/components/UserButton";
import { ApplicationLogoWithBrand } from "@/components/ApplicationLogo";
import { SearchButton } from "@/modules/search/ui/components/SearchButton";

export const MainNavbar = () => {
  return (
    <header className="sticky top-0 z-50 h-16 w-full border-b bg-sidebar px-2 xl:px-0">
      <div className="mx-auto flex h-full max-w-screen-xl items-center justify-between">
        <div className="flex items-center">
          <ApplicationLogoWithBrand />
        </div>
        <div>
          <nav className="flex items-center space-x-4">
            <SearchButton />

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
