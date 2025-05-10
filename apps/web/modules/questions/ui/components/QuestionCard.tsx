import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const QuestionCard = () => {
  return (
    <Link href="/question/1">
      <Card className="relative overflow-hidden bg-background transition-shadow duration-100 hover:shadow-md">
        <CardHeader className="pointer-events-none flex select-none flex-row items-center gap-3 space-y-0">
          <Badge className="text-base font-semibold" variant="secondary">
            Teknologi
          </Badge>
          <p className="text-sm text-muted-foreground">2 jam yang lalu</p>
        </CardHeader>
        <CardContent className="space-y-2 overflow-hidden">
          <CardTitle className="text-xl font-semibold">
            Apa itu React?
          </CardTitle>
          <p className="line-clamp-3 text-lg text-muted-foreground">
            Saya sedang belajar React, tapi saya masih bingung apa itu React?
            Apakah React itu sama dengan JavaScript? Mulai dari mana belajar
            React? Berikan saya panduan yang jelas puh.
          </p>
        </CardContent>
        <CardFooter className="flex items-center gap-3">
          <Avatar className="pointer-events-none size-8 shrink-0 select-none">
            <AvatarImage src="https://ui-avatars.com/api/?name=John+Doe" />
            <AvatarFallback>
              <span>U</span>
            </AvatarFallback>
          </Avatar>
          <p className="text-base text-muted-foreground">
            Ditanya oleh John Doe
          </p>
        </CardFooter>

        <div className="absolute right-0 top-0 flex h-24 w-24 flex-col items-center justify-center rounded-xl bg-background backdrop-blur-md">
          <span className="text-3xl font-bold">5</span>
          <p className="text-lg text-muted-foreground">Jawaban</p>
        </div>
      </Card>
    </Link>
  );
};

export const QuestionCardSkeleton = () => {
  return <Skeleton className="h-[284px] w-full" />;
};
