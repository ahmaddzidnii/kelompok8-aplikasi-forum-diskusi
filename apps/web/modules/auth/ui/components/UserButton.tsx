"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

export const UserButton = () => {
  const { data, status } = useSession();

  if (status === "loading") {
    return (
      <Skeleton className="pointer-events-none size-10 rounded-full">
        &nbsp;
      </Skeleton>
    );
  }

  if (!data && status === "unauthenticated") {
    return (
      <Button variant="outline" className="rounded-full">
        <Link href={`/auth/login`}>Login</Link>
      </Button>
    );
  }

  const menuItems = [
    [
      {
        label: "Profil Anda",
        href: `/@${data?.user.username}`,
      },
      {
        label: "Pengaturan",
        href: "/settings/profile",
      },
    ],
  ];

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <Avatar className="select-none">
          <AvatarImage
            src={data?.user.image as string}
            alt={`${data?.user.name}'s profile picture`}
          />
          <AvatarFallback>
            {`${data?.user.name?.charAt(0).toUpperCase()}`}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-5 w-72" side="bottom">
        <DropdownMenuLabel>{`${data?.user.name}`}</DropdownMenuLabel>
        <p className="px-2 text-xs text-muted-foreground">
          {data?.user.username}
        </p>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {menuItems[0].map((item) => (
            <DropdownMenuItem asChild key={item.label}>
              <Link href={item.href}>{item.label}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
