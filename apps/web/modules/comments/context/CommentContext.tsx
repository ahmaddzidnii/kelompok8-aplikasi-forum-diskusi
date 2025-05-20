import { createContext, useState, ReactNode } from "react";
import { trpc } from "@/trpc/client";

type SortType = "asc" | "desc";

type CommentUser = {
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
};

type Comment = {
  commentId: string;
  user: CommentUser;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  countReplies: number;
  isEdited: boolean;
  isOwner: boolean;
};

type CommentQuery = {
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
};

type CommentContextType = {
  isOpen: boolean;
  answerId?: string;
  sort: SortType;
  setSort: (sort: SortType) => void;
  setAnswerId: (answerId: string) => void;
  open: (answerId: string) => void;
  close: () => void;
  isLoading: boolean;
  isError: boolean;
  comments: Comment[];
  query: CommentQuery;
};

const defaultContext: CommentContextType = {
  isOpen: false,
  answerId: undefined,
  sort: "desc",
  setSort: () => {},
  setAnswerId: () => {},
  open: () => {},
  close: () => {},
  isLoading: false,
  isError: false,
  comments: [],
  query: {
    hasNextPage: false,
    fetchNextPage: () => {},
    isFetchingNextPage: false,
  },
};

export const CommentContext = createContext<CommentContextType>(defaultContext);

export const CommentProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [answerId, setAnswerId] = useState<string | undefined>(undefined);
  const [sort, setSortState] = useState<SortType>("desc");

  const open = (id: string) => {
    setAnswerId(id);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setAnswerId(undefined);
  };

  const toggleSort = (sort: SortType) => {
    setSortState(sort);
  };

  const {
    data,
    isLoading = false,
    isError = false,
    hasNextPage = false,
    fetchNextPage = () => {},
    isFetchingNextPage = false,
  } = trpc.comments.getTopLevelCommentsByAnswerId.useInfiniteQuery(
    { answerId: answerId as string, sort },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: Boolean(answerId && isOpen),
    },
  );

  const comments: Comment[] = data?.pages.flatMap((page) => page.items) || [];

  return (
    <CommentContext.Provider
      value={{
        isOpen,
        answerId,
        sort,
        setSort: toggleSort,
        setAnswerId,
        open,
        close,
        isLoading,
        isError,
        comments,
        query: {
          hasNextPage,
          fetchNextPage,
          isFetchingNextPage,
        },
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};
