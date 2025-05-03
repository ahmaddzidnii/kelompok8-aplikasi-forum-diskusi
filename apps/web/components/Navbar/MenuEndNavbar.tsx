import "server-only";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/modules/auth/ui/components/UserButton";

import { TooltipWrapper } from "@/components/TooltipWrapper";

export const MenuEndNavbar = async () => {
    const session = await auth();
    const isAuthenticated = !!session;
    return (
        <div className="flex flex-shrink-0 items-center gap-4">
            {isAuthenticated ? (
                <>
                    <TooltipWrapper content="Tanya Sesuatu">
                        <Button variant="outline" className="gap-0 [&_svg]:size-5 rounded-xl p md:px-4 py-2">
                            <PlusIcon />
                            <span className="ml-3 hidden md:block">Tanya sesuatu</span>
                        </Button>
                    </TooltipWrapper>
                    <UserButton />
                </>
            ) : (
                <Button asChild>
                    <Link href="/auth/login">Login</Link>
                </Button>
            )}
        </div>
    );
};