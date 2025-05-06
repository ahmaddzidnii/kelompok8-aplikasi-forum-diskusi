import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserMetaProps {
  username: string;
  name: string;
  avatar: string;
  bio?: string;
  createdAt: string;
}

export const UserMeta = ({
  username,
  name,
  avatar,
  bio,
  createdAt,
}: UserMetaProps) => {
  return (
    <Link prefetch={false} href={`/@${username}`}>
      <div className="flex w-full gap-2">
        <Avatar>
          <AvatarImage src={avatar} />
          <AvatarFallback>&nbsp;</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-base font-semibold">{name}</p>
          <p className="text-sm text-muted-foreground">
            {bio} • {createdAt}
          </p>
        </div>
      </div>
    </Link>
  );
};
