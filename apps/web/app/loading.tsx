import { Loader2Icon } from "lucide-react";

import { config } from "@/config";
import { ApplicationLogoOnly } from "@/components/ApplicationLogo";

const GlobalLoading = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col gap-4">
        <ApplicationLogoOnly />
        <span className="text-lg text-foreground/80">
          Aplikasi {config.appName} sedang dimuat.
        </span>
        <Loader2Icon className="size-9 animate-spin stroke-foreground/80" />
      </div>
    </div>
  );
};

export default GlobalLoading;
