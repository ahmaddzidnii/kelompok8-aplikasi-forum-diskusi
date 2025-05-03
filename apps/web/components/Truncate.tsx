"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

import { Button } from "./ui/button";

type TruncateProps = {
  children: React.ReactNode;
  maxHeight?: number;
  typeExpand?: "link" | "normal";
  linkHref?: string;
} & ( // Ensuring linkHref is required when typeExpand is "link"
  | { typeExpand?: "normal"; linkHref?: never }
  | { typeExpand: "link"; linkHref: string }
);

export default function Truncate({
  children,
  maxHeight = 100,
  typeExpand = "normal",
  linkHref,
}: TruncateProps) {
  const [expanded, setExpanded] = useState(false);
  const [needsTruncate, setNeedsTruncate] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      setNeedsTruncate(textRef.current.scrollHeight > maxHeight);
    }
  }, [children, maxHeight]);

  return (
    <div className="relative w-full">
      <div
        ref={textRef}
        className="relative overflow-hidden text-gray-800"
        style={{
          maxHeight: expanded ? "none" : maxHeight,
          transition: "max-height 0.3s ease",
        }}
      >
        {children}
        {needsTruncate && !expanded && (
          <div className="absolute bottom-0 left-0 h-10 w-full bg-gradient-to-t from-white to-transparent" />
        )}
      </div>
      {needsTruncate && (
        <div className="mt-2">
          {typeExpand === "normal" ? (
            <Button
              onClick={() => setExpanded(!expanded)}
              variant="outline"
              size="sm"
              className="w-full"
            >
              {expanded ? "Show Less" : "Show More"}
            </Button>
          ) : (
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href={linkHref as string}>{"Show More"}</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
