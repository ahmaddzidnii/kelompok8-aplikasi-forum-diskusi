import Link from "next/link";
import { FaBookmark, FaHome } from "react-icons/fa";
import { RiQuestionAnswerFill } from "react-icons/ri";

import { Button } from "@/components/ui/button";

export const MainSidebar = () => {
  return (
    <div className="hidden md:block">
      <div className="sticky top-[72px]">
        <div className="flex">
          <div
            style={{
              visibility: true ? "visible" : "hidden",
            }}
            className="h-9 w-1 rounded-full bg-primary"
          />
          <Button
            className="ml-1 w-full justify-start gap-0 px-1.5"
            variant="ghost"
            asChild
          >
            <Link href="/" className="flex items-center">
              <FaHome className="mr-2 size-4" />
              <span>Beranda</span>
            </Link>
          </Button>
        </div>
        <div className="flex">
          <div
            style={{
              visibility: false ? "visible" : "hidden",
            }}
            className="h-9 w-1 rounded-full bg-primary"
          />
          <Button
            className="ml-1 w-full justify-start gap-0 px-1.5"
            variant="ghost"
            asChild
          >
            <Link href="/threads/bookmark" className="flex items-center">
              <FaBookmark className="mr-2 size-4" />
              <span>Pertanyaan disimpan</span>
            </Link>
          </Button>
        </div>
        <div className="flex">
          <div
            style={{
              visibility: false ? "visible" : "hidden",
            }}
            className="h-9 w-1 rounded-full bg-primary"
          />
          <Button
            className="ml-1 w-full justify-start gap-0 px-1.5"
            variant="ghost"
            asChild
          >
            <Link href="/answers" className="flex items-center">
              <RiQuestionAnswerFill className="mr-2 size-4" />
              <span>Jawab pertanyaan</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
