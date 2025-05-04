"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBookmark, FaHome } from "react-icons/fa";
import { RiQuestionAnswerFill } from "react-icons/ri";

import { Button } from "@/components/ui/button";

export const MainSidebar = () => {
  const pathname = usePathname();

  // Menu items configuration
  const menuItems = [
    {
      path: "/",
      label: "Beranda",
      icon: FaHome,
    },
    {
      path: "/threads/bookmark",
      label: "Pertanyaan disimpan",
      icon: FaBookmark,
    },
    {
      path: "/answers",
      label: "Jawab pertanyaan",
      icon: RiQuestionAnswerFill,
    },
  ];

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
