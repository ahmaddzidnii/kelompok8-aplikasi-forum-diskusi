"use client";

import { FaSearch } from "react-icons/fa";
import { useSearchModal } from "./SearchModal";

export const SearchButton = () => {
  const { isOpen, setIsOpen } = useSearchModal();
  const handleSearchButtonClick = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      {/* Search button in mobile screen */}
      <div className="flex items-center md:hidden">
        <button onClick={handleSearchButtonClick}>
          <FaSearch className="size-5" />
        </button>
      </div>
      {/* Search button in dekstop screen */}
      <div
        onClick={handleSearchButtonClick}
        className="hidden h-10 w-[255px] cursor-pointer rounded-full border transition-all duration-200 ease-in-out hover:bg-muted/50 md:block"
      >
        <div className="flex h-full items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground">
          <FaSearch />
          <span>Cari di Forumdiskusi..</span>
        </div>
      </div>
    </>
  );
};
