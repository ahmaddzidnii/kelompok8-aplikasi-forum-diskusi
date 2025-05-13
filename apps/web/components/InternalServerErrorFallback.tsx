"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface InternalServerErrorProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  buttonText?: string;
  onRetry?: () => void;
}

export function InternalServerError({
  title = "Terjadi kesalahan pada server",
  description = "Silakan coba beberapa saat lagi atau hubungi administrator.",
  buttonText = "Muat Ulang",
  onRetry,
  className,
  ...props
}: InternalServerErrorProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div
      className={cn(
        "flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center md:min-h-[60vh]",
        className,
      )}
      {...props}
    >
      <div className="mx-auto mb-8 w-full max-w-[280px] md:max-w-[320px]">
        <ServerErrorIllustration />
      </div>
      <h1 className="mb-3 text-2xl font-bold text-gray-800 md:text-3xl">
        {title}
      </h1>
      <p className="mb-8 max-w-md text-gray-600">{description}</p>
      <Button size="lg" onClick={handleRetry} className="px-8 font-medium">
        {buttonText}
      </Button>
    </div>
  );
}

function ServerErrorIllustration() {
  return (
    <svg
      viewBox="0 0 500 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
    >
      <rect
        x="100"
        y="80"
        width="300"
        height="200"
        rx="10"
        fill="#E2E8F0"
        stroke="#94A3B8"
        strokeWidth="4"
      />
      <rect x="120" y="110" width="260" height="30" rx="5" fill="#CBD5E1" />
      <rect x="120" y="150" width="260" height="30" rx="5" fill="#CBD5E1" />
      <rect x="120" y="190" width="260" height="30" rx="5" fill="#CBD5E1" />
      <rect x="120" y="230" width="120" height="30" rx="5" fill="#CBD5E1" />
      <circle cx="250" cy="310" r="30" fill="#F87171" />
      <path
        d="M250 290V310M250 330V330.1"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M180 80L150 40M320 80L350 40"
        stroke="#94A3B8"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="8 8"
      />
      <path
        d="M150 40H350"
        stroke="#94A3B8"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M130 280L100 320M370 280L400 320"
        stroke="#94A3B8"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="8 8"
      />
      <path
        d="M100 320H400"
        stroke="#94A3B8"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M220 280L220 320M280 280L280 320"
        stroke="#94A3B8"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="8 8"
      />
      <path
        d="M160 110L160 280M340 110L340 280"
        stroke="#3B82F6"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="12 12"
        opacity="0.5"
      />
      <path
        d="M220 60L220 80M280 60L280 80"
        stroke="#94A3B8"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="220" cy="50" r="10" fill="#3B82F6" />
      <circle cx="280" cy="50" r="10" fill="#3B82F6" />
      <path
        d="M200 190L240 230M240 190L200 230"
        stroke="#EF4444"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M260 190L300 230M300 190L260 230"
        stroke="#EF4444"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}
