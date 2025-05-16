import Link from "next/link";
import { id } from "date-fns/locale";
import { formatDistanceToNow } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserMetaProps {
  username: string;
  name: string;
  avatar: string;
  bio?: string;
  createdAt: string;
  withBio?: boolean;
}

export const UserMeta = ({
  username,
  name,
  avatar,
  bio,
  createdAt,
  withBio = true,
}: UserMetaProps) => {
  return (
    <Link prefetch={false} href={`/@${username}`}>
      <div className="flex w-full items-center gap-2">
        <Avatar>
          <AvatarImage src={avatar} />
          <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-base font-semibold">{name}</p>
          {withBio && (
            <p className="text-sm text-muted-foreground">
              {bio} •&nbsp;
              {formatDistanceToNow(createdAt, {
                addSuffix: true,
                locale: id,
                includeSeconds: true,
              }).replace(/^\s*\D*?(\d+.*)/, "$1")}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};
