import React, { createContext, useState, useMemo, useCallback } from "react";
import { trpc } from "@/trpc/client";

interface ReplyUser {
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
}

interface ReplyItem {
  commentId: string;
  user: ReplyUser;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  replyingTo: {
    username: string | null | undefined;
  };
  isEdited: boolean;
  isOwner: boolean;
}

interface ReplyQuery {
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
}

interface ReplyContextType {
  isOpen: boolean;
  parentCommentId?: string;
  setParentCommentId: (commentId?: string) => void;
  open: (commentId: string) => void;
  close: () => void;
  isLoading?: boolean;
  replies: ReplyItem[];
  query: ReplyQuery;
}

const defaultContext: ReplyContextType = {
  isOpen: false,
  parentCommentId: undefined,
  setParentCommentId: () => {},
  open: () => {},
  close: () => {},
  replies: [],
  query: {
    hasNextPage: false,
    fetchNextPage: () => {},
    isFetchingNextPage: false,
  },
};

export const ReplyContext = createContext<ReplyContextType>(defaultContext);

export const ReplyProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [parentCommentId, setParentCommentId] = useState<string | undefined>();

  const open = useCallback((commentId: string) => {
    setParentCommentId(commentId);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setParentCommentId(undefined);
  }, []);

  const {
    data,
    isLoading,
    hasNextPage = false,
    isFetchingNextPage = false,
    fetchNextPage = () => {},
  } = trpc.comments.getRepliesByParentCommentId.useInfiniteQuery(
    { parentCommentId: parentCommentId ?? "" },
    {
      enabled: Boolean(parentCommentId && isOpen),
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const replies = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  const contextValue = useMemo(
    () => ({
      isOpen,
      parentCommentId,
      setParentCommentId,
      open,
      close,
      replies,
      query: {
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
      },
      isLoading,
    }),
    [
      isOpen,
      parentCommentId,
      replies,
      hasNextPage,
      fetchNextPage,
      isFetchingNextPage,
      isLoading,
      open,
      close,
    ],
  );

  return (
    <ReplyContext.Provider value={contextValue}>
      {children}
    </ReplyContext.Provider>
  );
};
