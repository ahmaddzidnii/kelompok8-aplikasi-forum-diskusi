"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { type JsonValue } from "@prisma/client/runtime/library";

import { cn } from "@/lib/utils";
import { Loader } from "@/components/Loader";
import { transformJsonToHtml } from "@/lib/transform-json-to-html";

interface TruncatedContentProps {
  content: JsonValue;
  maxHeight?: number;
  className?: string;
}

export const TruncatedContent = ({
  content,
  maxHeight = 128, // 32 * 4 = 128px (h-32)
  className,
}: TruncatedContentProps) => {
  const [isClient, setIsClient] = useState(false);
  const [isTruncated, setIsTruncated] = useState(true);
  const [needsTruncation, setNeedsTruncation] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleToggleTruncate = () => {
    setIsTruncated(!isTruncated);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && contentRef.current) {
      // Delay sedikit agar DOM benar-benar ter-render
      const timeout = setTimeout(() => {
        const contentHeight = contentRef.current?.scrollHeight ?? 0;
        setNeedsTruncation(contentHeight > maxHeight);
      }, 10);
      return () => clearTimeout(timeout);
    }
  }, [isClient, maxHeight, content]);

  if (!isClient) {
    return (
      <div style={{ height: maxHeight }}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <div
        ref={contentRef}
        className={cn(
          "minimal-tiptap-editor overflow-hidden transition-all duration-500 ease-in-out",
          isTruncated && needsTruncation ? "relative" : "",
        )}
        style={{
          maxHeight: isTruncated && needsTruncation ? `${maxHeight}px` : "none",
        }}
      >
        <div
          className="ProseMirror"
          dangerouslySetInnerHTML={{
            __html: transformJsonToHtml(content),
          }}
        />
      </div>

      {/* Gradient Overlay - hanya tampil jika truncated dan butuh truncation */}
      {isTruncated && needsTruncation && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-sidebar via-background/90 to-transparent"
          style={{ bottom: 0 }}
        />
      )}

      {/* Toggle Button - hanya tampil jika konten butuh truncation */}
      {needsTruncation && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={handleToggleTruncate}
            style={{ zIndex: 999 }}
            className={cn(
              "group flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2",
              "text-sm font-medium text-gray-700 shadow-sm transition-all duration-200",
              "hover:border-gray-300 hover:bg-gray-50 hover:shadow-md",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
              "active:scale-95",
            )}
          >
            <span>{isTruncated ? "Lihat Selengkapnya" : "Lebih Sedikit"}</span>
            {isTruncated ? (
              <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            ) : (
              <ChevronUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};
