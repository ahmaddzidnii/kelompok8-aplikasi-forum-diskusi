import { FaChevronDown } from "react-icons/fa";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useComment } from "../../hooks/UseComment";

export const CommentFilter = () => {
  const { sort, setSort } = useComment();

  const handleSortChange = (value: "asc" | "desc") => {
    setSort?.(value);
  };
  return (
    <div className="flex w-full items-center justify-between">
      <h1 className="text-base font-semibold">Komentar :</h1>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="outline">
            <span className="text-[14px]">
              {sort == "desc" ? "Terbaru" : "Terlama"}
            </span>
            <FaChevronDown className="ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
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
