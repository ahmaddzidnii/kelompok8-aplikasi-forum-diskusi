"use client";

import { Separator } from "@/components/ui/separator";
import { config } from "@/config";

export const Footer = () => {
  return (
    <footer className="mt-5">
      <Separator />
      <div className="flex h-12 items-center justify-center">
        <span className="text-sm">
          © {new Date().getFullYear().toString()} {config.appName}
        </span>
      </div>
    </footer>
  );
};
