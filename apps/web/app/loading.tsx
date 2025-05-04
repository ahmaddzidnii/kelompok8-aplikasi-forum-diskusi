import Image from "next/image";
import { Loader2Icon } from "lucide-react";

import { config } from "@/config";

const GlobalLoading = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col gap-4">
        <div className="relative aspect-square size-14 overflow-hidden rounded-full transition-opacity duration-200 hover:opacity-80">
          <Image
            src="https://cdn.pixabay.com/photo/2022/01/30/13/33/github-6980894_960_720.png"
            alt="logo"
            fill
          />
        </div>
        <span className="text-lg text-foreground/80">
          Aplikasi {config.appName} sedang dimuat.
        </span>
        <Loader2Icon className="size-9 animate-spin stroke-foreground/80" />
      </div>
    </div>
  );
};

export default GlobalLoading;
