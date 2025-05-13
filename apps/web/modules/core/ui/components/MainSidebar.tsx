"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaCircleQuestion } from "react-icons/fa6";
import { FaBookmark, FaHome } from "react-icons/fa";
import { RiQuestionAnswerFill } from "react-icons/ri";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Menu items configuration
const menuItems = [
  {
    path: "/",
    label: "Beranda",
    icon: FaHome,
    authRequired: false,
  },
  {
    path: "/questions/my-question",
    label: "Pertanyaan anda",
    icon: FaCircleQuestion,
    authRequired: true,
  },
  {
    path: "/bookmarks",
    label: "Jawaban tersimpan",
    icon: FaBookmark,
    authRequired: true,
  },
  {
    path: "/answers",
    label: "Jawab pertanyaan",
    icon: RiQuestionAnswerFill,
    authRequired: true,
  },
];
export const MainSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="hidden md:block">
      <div className="sticky top-[72px]">
        {menuItems.map((item) => (
          <div className="flex" key={item.path}>
            <div
              className="h-9 w-1 rounded-full bg-primary"
              style={{
                visibility: pathname === item.path ? "visible" : "hidden",
              }}
            />
            <Button
              className="ml-1 w-full justify-start gap-0 px-1.5"
              variant="ghost"
              asChild
            >
              <Link href={item.path} className="flex items-center">
                {React.createElement(item.icon, { className: "mr-2 size-4" })}
                <span>{item.label}</span>
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const MobileSidebar = () => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  return (
    <nav className="fixed bottom-0 left-0 z-50 grid h-16 w-full grid-cols-4 border-t bg-white px-2 shadow-md md:hidden">
      {menuItems.map((item) => (
        <Button
          key={item.path}
          variant="ghost"
          asChild
          className={cn(
            "h-full [&_svg]:size-6",
            isActive(item.path) && "[&_svg]:fill-primary",
          )}
        >
          <Link href={item.path}>
            {React.createElement(item.icon, { className: "size-4" })}
          </Link>
        </Button>
      ))}
    </nav>
  );
};
