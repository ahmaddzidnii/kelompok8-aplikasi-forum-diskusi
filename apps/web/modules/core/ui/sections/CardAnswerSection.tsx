import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AvatarComponent } from "@/components/AvatarComponent";
import { auth } from "@/auth";

export const CardAnswerSection = async () => {
  const session = await auth();
  if (!session) return null;
  return (
    <Card className="rounded-xl">
      <CardContent className="px-5 py-2.5">
        <div className="flex w-full gap-2">
          <AvatarComponent
            src={session.user.image || "/avatar.png"}
            alt={session.user.name || "ahmaddzidnii"}
          />
          <div className="flex-1">
            <Link href="/questions/ask">
              <div className="flex h-10 w-full cursor-pointer items-center rounded-xl border">
                <span className="ml-2 text-sm text-muted-foreground">
                  Tanyakan Sesuatu?
                </span>
              </div>
            </Link>
            <Button className="mt-2 w-full" variant="outline" asChild>
              <Link href="/questions/ask">Tanyakan</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
