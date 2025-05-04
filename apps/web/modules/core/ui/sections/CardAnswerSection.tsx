import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const CardAnswerSection = () => {
  return (
    <Card className="rounded-xl">
      <CardContent className="px-5 py-2.5">
        <div className="flex w-full gap-2">
          <Avatar>
            <AvatarImage src="/avatar.png" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Link href="/threads/ask">
              <div className="flex h-10 w-full cursor-pointer items-center rounded-xl border">
                <span className="ml-2 text-sm text-muted-foreground">
                  Tanyakan Sesuatu?
                </span>
              </div>
            </Link>
            <Button className="mt-2 w-full" variant="outline" asChild>
              <Link href="/threads/ask">Tanyakan</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
