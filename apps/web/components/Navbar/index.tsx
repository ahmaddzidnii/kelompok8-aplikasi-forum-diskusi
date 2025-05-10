import "server-only";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { MenuEndNavbar } from "@/components/Navbar/MenuEndNavbar";

import { ApplicationLogoOnly } from "../ApplicationLogo";

interface NavbarProps {
  title: string;
  hrefTitle: string;
  className?: string;
}

export const Navbar = ({ title, hrefTitle, className }: NavbarProps) => {
  return (
    <header className={cn("z-50 w-full border-b bg-sidebar px-5", className)}>
      <div className="flex h-14 w-full items-center justify-between">
        <div className="flex h-full w-full items-center gap-3">
          <div className="flex flex-shrink-0 items-center gap-3">
            <ApplicationLogoOnly />
            <Link
              href={hrefTitle}
              className="text-base font-bold text-foreground"
            >
              {title}
            </Link>
          </div>
        </div>
        <MenuEndNavbar />
      </div>
    </header>
  );
};
