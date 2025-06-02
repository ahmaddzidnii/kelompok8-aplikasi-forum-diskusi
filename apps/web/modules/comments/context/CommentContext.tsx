import {
  createContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { trpc } from "@/trpc/client";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/trpc/routers/_app";

type SortType = "asc" | "desc";

type RouterOutput = inferRouterOutputs<AppRouter>;

export type Comment =
  RouterOutput["comments"]["getTopLevelCommentsByAnswerId"]["items"][0];

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
  const [sort, setSort] = useState<SortType>("desc");

  // Gunakan useCallback agar referensi stabil
  const open = useCallback((id: string) => {
    setAnswerId(id);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setAnswerId(undefined);
  }, []);

  const setSortCallback = useCallback((sort: SortType) => {
    setSort(sort);
  }, []);

  const setAnswerIdCallback = useCallback((id: string) => {
    setAnswerId(id);
  }, []);

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

  const comments: Comment[] = useMemo(
    () => data?.pages.flatMap((page) => page.items) || [],
    [data],
  );

  // Memoize context value
  const contextValue = useMemo(
    () => ({
      isOpen,
      answerId,
      sort,
      setSort: setSortCallback,
      setAnswerId: setAnswerIdCallback,
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
    }),
    [
      isOpen,
      answerId,
      sort,
      setSortCallback,
      setAnswerIdCallback,
      open,
      close,
      isLoading,
      isError,
      comments,
      hasNextPage,
      fetchNextPage,
      isFetchingNextPage,
    ],
  );

  return (
    <CommentContext.Provider value={contextValue}>
      {children}
    </CommentContext.Provider>
  );
};
