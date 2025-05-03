import "server-only";
import Link from "next/link";
import Image from "next/image";
import { MenuIcon } from "lucide-react";

import { MenuEndNavbar } from "@/components/Navbar/MenuEndNavbar";
import { cn } from "@/lib/utils";


interface NavbarProps {
    title: string;
    hrefTitle: string;
    className?: string
    customTrigger?: React.ReactNode
}

export const Navbar = ({ title, hrefTitle, className, customTrigger }: NavbarProps) => {
    return (
        <header className={cn("z-50 w-full border-b bg-sidebar px-2 pr-5", className)}>
            <div className="flex h-14 w-full items-center justify-between">
                <div className="flex h-full w-full items-center gap-3">
                    {/* Sidebar Button and logo*/}
                    {customTrigger ? customTrigger : (
                        <MenuIcon />
                    )}
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
                            href={hrefTitle}
                            className="text-base font-bold text-primary"
                        >
                            {title}
                        </Link>
                    </div>
                </div>
                <MenuEndNavbar />
            </div>
        </header>
    );
}