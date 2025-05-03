import Link from "next/link";
import { Briefcase, Calendar, MapPin } from "lucide-react";

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserPageSidebarProps {
  user: any; //TODO: Define the user type
}

export const UserPageSidebar = async ({ user }: UserPageSidebarProps) => {
  const session = await auth();
  return (
    <>
      {/* User profile mobile device */}
      <Card className="overflow-hidden md:hidden">
        <div className="h-32 bg-gradient-to-t from-primary/35 to-secondary"></div>
        <CardContent className="relative pt-0">
          <div className="flex items-start justify-between">
            <Avatar className="-mt-12 size-24 border-4 border-background bg-background">
              <AvatarImage
                src={user?.image || "https://avatar.iran.liara.run/public"}
                title={user?.name || "avatar"}
                alt={user?.name || "avatar"}
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <h1 className="text-2xl font-bold">{user.name || "Ahmad Zidni Hidayat"}</h1>
              <p className="text-muted-foreground">{user.username || "ahmaddzidnii"}</p>
            </div>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/settings/profile">Edit Profile</Link>
            </Button>
            <p>
              {user.bio || "Belum ada bio yang ditambahkan."}
            </p>
            {
              user.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{user.location}</span>
                </div>
              )}
            {user.organization && (
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span>{user.organization}</span>
              </div>
            )
            }

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                Bergabung pada{" "}
                {new Intl.DateTimeFormat("id-ID", {
                  day: "numeric",
                  year: "numeric",
                  month: "long",
                }).format(user.createdAt)}
              </span>
            </div>
          </div>

        </CardContent>
      </Card >

      {/* User profile desktop device */}
      <div className="hidden w-full shrink-0 space-y-5 md:block" >
        <Avatar className=":size-[296px] aspect-square size-[256px] overflow-hidden rounded-full border-[5px] border-muted md:block">
          <AvatarImage
            src={user?.image || "https://avatar.iran.liara.run/public"}
            alt={user.name || "avatar"}
            title={user.name || "avatar"}
          />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-lg text-muted-foreground">{user.username}</p>
        </div>
        {
          session?.user.id === user.id && (
            <Button className="w-full" variant="outline" asChild>
              <Link href="/settings/profile">Edit Profile</Link>
            </Button>
          )
        }
        {
          user.bio ? (
            <p className="line-clamp-4 text-muted-foreground">{user.bio}</p>
          ) : (
            <p className="line-clamp-4 text-muted-foreground">
              Belum ada bio yang ditambahkan.
            </p>
          )
        }
        <div className="space-y-2 text-sm">
          {user.location && (
            <div className="flex items-center gap-2">
              <MapPin className="size-4" />
              <span>{user.location}</span>
            </div>
          )}
          {user.organization && (
            <div className="flex items-center gap-2">
              <Briefcase className="size-4" />
              <span>{user.organization}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="size-4" />
            <span>
              Bergabung pada{" "}
              {new Intl.DateTimeFormat("id-ID", {
                day: "numeric",
                year: "numeric",
                month: "long",
              }).format(user.createdAt)}
            </span>
          </div>
        </div>
      </div >
    </>
  );
};
