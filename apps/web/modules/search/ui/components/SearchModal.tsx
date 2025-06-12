"use client";
import * as React from "react";
import { create } from "zustand";
import { Search, X } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

interface SearchModalState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useSearchModal = create<SearchModalState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}));

export const SearchModal = () => {
  const { isOpen, setIsOpen } = useSearchModal();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearchRedirect();
    }
  };

  const handleSearchRedirect = () => {
    const searchParams = new URLSearchParams({ q: searchQuery.trim() });
    setIsOpen(false);
    router.push(`/search?${searchParams.toString()}`);
  };

  const handleReset = () => {
    setSearchQuery("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleCloseModal = () => {
    {
      setIsOpen(false);
      setSearchQuery("");
      if (inputRef.current) {
        inputRef.current.value = "";
        inputRef.current.focus();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="overflow-hidden sm:max-w-[600px] md:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Pencarian</DialogTitle>
          <DialogDescription>
            Temukan pertanyaan dan jawaban di forum diskusi
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 break-words">
          <form className="flex" onSubmit={handleSubmit}>
            <div className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Cari pertanyaan, atau user..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10"
                  autoFocus
                />
                {searchQuery && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0 hover:bg-muted"
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Reset pencarian</span>
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>

        {searchQuery && (
          <div className="word-wrap break-word max-w-full overflow-hidden">
            {/* Search Query Display */}
            <Button
              type="button"
              variant="ghost"
              onClick={handleSearchRedirect}
              className="grid h-auto w-full grid-cols-[max-content_minmax(0,auto)_max-content] justify-start gap-2 rounded-md bg-muted/50 px-3 py-2 hover:bg-muted/70"
            >
              <Search className="h-3 w-3 self-start text-muted-foreground" />
              <div className="min-w-0 text-left">
                <p className="whitespace-normal break-words text-left text-sm font-medium">
                  &#34;{searchQuery}&#34;
                </p>
              </div>
              <span className="self-start text-[10px] text-muted-foreground">
                Cari semua di Forumdiskusi.
              </span>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
