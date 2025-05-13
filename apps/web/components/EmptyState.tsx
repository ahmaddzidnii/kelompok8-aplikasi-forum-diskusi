import type React from "react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = "Belum ada data yang tersedia",
  description = "Daftar ini masih kosong.",
  icon,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg bg-background p-8 text-center",
        className,
      )}
      {...props}
    >
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        {icon || <EmptyBoxIcon className="h-10 w-10 text-muted-foreground" />}
      </div>
      <h3 className="mt-6 text-lg font-medium">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function EmptyBoxIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 7.5v9l-4-2-4 2-4-2-4 2v-9l4-2 4 2 4-2 4 2z" />
      <path d="M4 15.5v-8l4-2 4 2 4-2 4 2v8" />
      <path d="M12 13.5v-4" />
      <path d="M8 9.5v4" />
      <path d="M16 9.5v4" />
    </svg>
  );
}
