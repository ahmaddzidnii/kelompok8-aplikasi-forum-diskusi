import { SearchIcon } from "lucide-react";

export const SearchInput = () => {
  return (
    <form
      className="flex w-full max-w-[600px]"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search"
          className="w-full rounded-l-full border py-2 pl-4 pr-12 focus:border-blue-500 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="rounded-r-full border-l-0 bg-border px-5 py-2.5 hover:bg-border/80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <SearchIcon className="size-5" />
      </button>
    </form>
  );
};
