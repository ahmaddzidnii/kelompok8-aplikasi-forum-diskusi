import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const CardThreadList = () => {
  return (
    <Card>
      <CardContent className="space-y-4 px-5 py-2.5">
        <Link href="/@ahmaddzidnii">
          <div className="flex w-full gap-2">
            <Avatar>
              <AvatarImage src="/avatar.png" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-base font-semibold">Ahmad Zidni Hidayat</p>
              <p className="text-sm text-muted-foreground">
                Web Developer at Lorem .inc • 2 hari yang lalu
              </p>
            </div>
          </div>
        </Link>
        <p className="text-base font-semibold">
          Kenapa react js sangat populer, apa saja kelebihan dan kekurangannya ?
        </p>
        <Button variant="default" className="w-full" asChild>
          <Link
            prefetch={false}
            href="/threads/mengapa-react-js-sangat-popular-637353"
          >
            Lihat diskusi
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export const ThreadsListSection = () => {
  return (
    <ul>
      {Array.from({ length: 5 }, (_, index) => (
        <li key={index} className="mb-4">
          <CardThreadList />
        </li>
      ))}
    </ul>
  );
};
