import Link from "next/link";

import { MenuEndNavbar } from "@/components/Navbar/MenuEndNavbar";

import { ApplicationLogoOnly } from "@/components/ApplicationLogo";
import { TabsProfile } from "@/modules/user-profile/ui/components/TabsProfile";

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
    <header className="z-50 w-full border-b bg-sidebar px-5">
      <div className="flex h-14 w-full items-center">
        <div className="flex h-full w-full items-center gap-4">
          <div className="flex flex-shrink-0 items-center gap-3">
            <div className="flex flex-shrink-0 items-center gap-3">
              <ApplicationLogoOnly />
              <Link
                href={`/@${username}`}
                className="text-base font-bold text-foreground"
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
