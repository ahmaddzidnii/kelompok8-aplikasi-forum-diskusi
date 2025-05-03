"use client";

import Link from "next/link";
import { SettingsIcon, UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

const SettingsSidebar = () => {
  const pathname = usePathname();
  return (
    <div className="sticky top-0 pt-4">
      <div className="flex">
        <div
          style={{
            visibility: pathname === "/settings/profile" ? "visible" : "hidden",
          }}
          className="h-9 w-1 rounded-full bg-primary"
        />
        <Button
          className="ml-1 w-full justify-start gap-0 px-1.5"
          variant="ghost"
          asChild
        >
          <Link href="/settings/profile" className="flex items-center">
            <UserIcon className="mr-2 size-4" />
            <span>Profile</span>
          </Link>
        </Button>
      </div>
      <div className="flex">
        <div
          style={{
            visibility: pathname === "/settings/account" ? "visible" : "hidden",
          }}
          className="h-9 w-1 rounded-full bg-primary"
        />
        <Button
          className="ml-1 w-full justify-start gap-0 px-1.5"
          variant="ghost"
          asChild
        >
          <Link href="/settings/account" className="flex items-center">
            <SettingsIcon className="mr-2 size-4" />
            <span>Account</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default SettingsSidebar;
