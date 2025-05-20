import { trpc } from "@/trpc/client";
import { createContext, useState } from "react";

type ReplyContextType = {
  isOpen: boolean;
  parentCommentId: string | undefined;
  setParentCommentId: (commentId: string) => void;
  open: (commentId: string) => void;
  close: () => void;
  isLoading?: boolean;
  replies: {
    commentId: string;
    user: {
      id: string;
      name: string | null;
      username: string | null;
      image: string | null;
    };
    content: string;
    createdAt: Date;
    updatedAt: Date;
    replyingTo: {
      username: string | null;
    };
    isEdited: boolean;
    isOwner: boolean;
  }[];
};

export const ReplyContext = createContext<ReplyContextType>({
  isOpen: false,
  parentCommentId: undefined,
  setParentCommentId: () => {},
  open: () => {},
  close: () => {},
  replies: [],
});

export const ReplyProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [parentCommentId, setParentCommentId] = useState<string | undefined>(
    undefined,
  );

  const open = (commentId: string) => {
    setParentCommentId(commentId);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setParentCommentId(undefined);
  };

  const { data: replies = [], isLoading } =
    trpc.comments.getRepliesByParentCommentId.useQuery(
      { parentCommentId: parentCommentId as string },
      {
        enabled: !!parentCommentId && isOpen,
      },
    );

  return (
    <ReplyContext.Provider
      value={{
        isOpen,
        parentCommentId,
        setParentCommentId,
        open,
        close,
        replies,
        isLoading,
      }}
    >
      {children}
    </ReplyContext.Provider>
  );
};
