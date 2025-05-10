import "server-only";

import Link from "next/link";
import { FaPlus } from "react-icons/fa6";

import { UserButton } from "@/modules/auth/ui/components/UserButton";

import { Button } from "@/components/ui/button";

export const MenuEndNavbar = async () => {
  return (
    <div className="flex flex-shrink-0 items-center gap-4">
      <Button variant="default" asChild>
        <Link href="/questions/ask">
          <div className="flex items-center gap-2">
            <span className="hidden md:block">Tanyakan sesuatu</span>
            <FaPlus />
          </div>
        </Link>
      </Button>

      <UserButton />
    </div>
  );
};
