import { cva, VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const avatarVariants = cva("", {
  variants: {
    size: {
      lg: "size-10",
      md: "size-8",
      sm: "size-6",
    },
  },
  defaultVariants: {
    size: "lg",
  },
});

interface AvatarComponentProps extends VariantProps<typeof avatarVariants> {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
}

export const AvatarComponent = ({
  alt,
  src,
  fallback,
  className,
  size,
}: AvatarComponentProps) => {
  return (
    <Avatar className={cn(avatarVariants({ size, className }))}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback>{fallback || "FD"}</AvatarFallback>
    </Avatar>
  );
};
