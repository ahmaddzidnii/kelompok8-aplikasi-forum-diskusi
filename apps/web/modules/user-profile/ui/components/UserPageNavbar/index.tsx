import Link from "next/link";
import Image from "next/image";

import { MenuEndNavbar } from "@/components/Navbar/MenuEndNavbar";

import { TabsProfile } from "../TabsProfile";
import { MenuIcon } from "lucide-react";

interface UserPageNavbarProps {
  username?: string | null;
  countQuestion?: number;
  countAnswer?: number;

}

export const UserPageNavbar = ({
  username,
  countAnswer,
  countQuestion,
}: UserPageNavbarProps) => {
  return (
    <header className="z-50 w-full border-b bg-sidebar px-2 pr-5">
      <div className="flex h-14 w-full items-center">
        <div className="flex h-full w-full items-center gap-4">
          <div className="flex flex-shrink-0 items-center gap-3">
            <MenuIcon />
            <div className="flex flex-shrink-0 items-center gap-3">
              <div className="relative aspect-square size-8 overflow-hidden rounded-full transition-opacity duration-200 hover:opacity-80">
                <Link href="/">
                  <Image
                    src="https://cdn.pixabay.com/photo/2022/01/30/13/33/github-6980894_960_720.png"
                    alt="logo"
                    fill
                  />
                </Link>
              </div>
              <Link
                href={`/@${username}`}
                className="text-base font-bold text-primary"
              >
                {username || "ahmaddzidnii"}
              </Link>
            </div>

          </div>

          {/* Auth Button */}
          <div className="ms-auto flex-shrink-0">
            <MenuEndNavbar />
          </div>
        </div>
      </div>
      <TabsProfile countAnswer={countAnswer} countQuestion={countQuestion} />
    </header>
  );
};

