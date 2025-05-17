"use client";

import { useQueryState } from "nuqs";
import { useRouter } from "next/navigation";
import { FaChevronDown } from "react-icons/fa6";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const LABELS = {
  recommended: "Disarankan",
  desc: "Terbaru",
  asc: "Terlama",
} as const;

function getSortLabel(sort: string) {
  switch (sort) {
    case "recommended":
      return LABELS.recommended;
    case "desc":
      return LABELS.desc;
    case "asc":
      return LABELS.asc;
    default:
      return LABELS.recommended;
  }
}

export const AnswerFilter = () => {
  const [answerSort, setAnswerSort] = useQueryState("answerSort", {
    defaultValue: "recommended",
    clearOnDefault: true,
  });

  const router = useRouter();

  const handleSortChange = (sort: string) => {
    setAnswerSort(sort).then(() => {
      router.refresh();
    });
  };

  return (
    <div className="flex w-full items-center justify-between">
      <h1 className="text-base font-semibold">Jawaban :</h1>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <span className="text-[14px]">{getSortLabel(answerSort)}</span>
            <FaChevronDown className="ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => handleSortChange("recommended")}
            className="cursor-pointer"
          >
            Disarankan
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleSortChange("desc")}
            className="cursor-pointer"
          >
            Terbaru
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => handleSortChange("asc")}
            className="cursor-pointer"
          >
            Terlama
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
