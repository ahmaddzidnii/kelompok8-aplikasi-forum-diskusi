import Link from "next/link";
import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { id } from "date-fns/locale";
import { formatDistanceToNow } from "date-fns";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

import { AutosizeTextarea } from "@/components/ui/textarea-auto-size";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useComment } from "@/modules/comments/hooks/UseComment";
import { ReplyProvider } from "@/modules/comments/context/ReplyContext";
import { useReplies } from "@/modules/comments/hooks/useReplies";
import { Loader } from "@/components/Loader";
import { EmptyState } from "@/components/EmptyState";
import { InfiniteScroll } from "@/components/InfiniteScroll";
import { AvatarComponent } from "@/components/AvatarComponent";
import { useReplyMutation } from "@/modules/comments/hooks/useReplyMutation";

type CommentType = {
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
  countReplies: number;
  isEdited: boolean;
  isOwner: boolean;
};

export const CommentList = () => {
  const { comments, query } = useComment();

  if (comments.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul className="space-y-4">
      {comments.map((comment, i) => (
        <ReplyProvider key={comment.commentId + i}>
          <Comment comment={comment} />
        </ReplyProvider>
      ))}
      <InfiniteScroll
        fetchNextPage={query.fetchNextPage}
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        isManual={false}
      />
    </ul>
  );
};

const Comment = ({ comment }: { comment: CommentType }) => {
  const [isReplyFormOpen, setIsReplyFormOpen] = useState(false);
  const router = useRouter();
  const { status } = useSession();
  const { open, close, isOpen, parentCommentId, setParentCommentId } =
    useReplies();
  const { answerId } = useComment();
  const mutationReply = useReplyMutation();

  const toggleReplies = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open(comment.commentId);
    }
  }, [isOpen, close, open, comment.commentId]);

  const handleReplySubmit = useCallback(
    (content: string) => {
      if (status === "unauthenticated") {
        router.replace("/auth/login");
        return;
      }
      mutationReply.mutate(
        {
          content,
          parentCommentId: parentCommentId as string,
          replyToCommentId: parentCommentId as string,
          answerId: answerId as string,
        },
        {
          onSuccess: () => {
            toast.success("Balasan berhasil dikirim");
            setIsReplyFormOpen(false);
          },
        },
      );
    },
    [status, router, mutationReply, parentCommentId, answerId],
  );

  const hasReplies = comment.countReplies > 0;

  return (
    <li className="flex gap-2">
      <Avatar className="size-8">
        <AvatarImage
          src={
            comment.user.image ||
            "https://ui-avatars.com/api/?name=M&background=2c2c2c&color=ffff"
          }
        />
        <AvatarFallback>
          {comment.user.name?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex w-full flex-col">
        <div className="flex w-max items-center gap-1">
          <span className="font-bold">{comment.user.name}</span>
          {comment.isOwner && (
            <span className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 shadow-sm">
              Penulis
            </span>
          )}
          <span className="text-xs font-medium text-muted-foreground">
            • &nbsp;
            {formatDistanceToNow(comment.createdAt, {
              addSuffix: true,
              locale: id,
              includeSeconds: true,
            }).replace(/^\s*\D*?(\d+.*)/, "$1")}
          </span>
        </div>

        <p className="text-sm">{comment.content}</p>

        <button
          className="text-left text-xs font-semibold"
          onClick={() => {
            if (status === "unauthenticated") {
              router.replace("/auth/login");
              return;
            }
            setParentCommentId(comment.commentId);
            setIsReplyFormOpen((prev) => !prev);
          }}
        >
          Balas
        </button>

        {isReplyFormOpen && (
          <ReplyForm
            onSubmit={handleReplySubmit}
            onCancel={() => setIsReplyFormOpen(false)}
            replyToUsername={comment.user.username}
          />
        )}

        {hasReplies && (
          <CommentReplyButton
            toggleReplies={toggleReplies}
            countReplies={comment.countReplies}
          />
        )}

        <CommentReplyList />
      </div>
    </li>
  );
};

const ReplyForm = ({
  onSubmit,
  onCancel,
  replyToUsername,
}: {
  onSubmit: (content: string) => void;
  onCancel: () => void;
  replyToUsername?: string | null;
}) => {
  const [replyContent, setReplyContent] = useState("");
  const { status, data } = useSession();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (status === "unauthenticated") {
      toast.error("Silakan login untuk membalas komentar.");
      return;
    }

    if (replyContent.trim()) {
      onSubmit(replyContent);
    } else {
      toast.error("Balasan tidak boleh kosong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <div className="flex gap-2">
        <AvatarComponent
          size="sm"
          src={
            data?.user.image ||
            "https://ui-avatars.com/api/?name=M&background=2c2c2c&color=ffff"
          }
          alt={data?.user.name || "User"}
        />
        <div className="flex-1">
          <AutosizeTextarea
            autoFocus
            className="w-full resize-none rounded-md border border-input bg-background p-2 text-sm"
            placeholder={
              replyToUsername
                ? `Balas ke @${replyToUsername}...`
                : "Tulis balasan..."
            }
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            maxHeight={300}
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md px-3 py-1 text-xs text-muted-foreground hover:bg-muted"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!replyContent.trim()}
              className="rounded-md bg-primary px-3 py-1 text-xs text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              Kirim
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

const CommentReplyButton = ({
  toggleReplies,
  countReplies,
}: {
  toggleReplies: () => void;
  countReplies: number;
}) => {
  const { isOpen } = useReplies();
  return (
    <button
      onClick={toggleReplies}
      className="mt-2 flex w-max justify-start gap-2 ps-0 text-primary"
    >
      {isOpen ? (
        <span className="flex items-center gap-1 text-xs font-semibold">
          <FaChevronUp size={12} />
          Tutup Balasan
        </span>
      ) : (
        <span className="flex items-center gap-1 text-xs font-semibold">
          <FaChevronDown size={12} />
          Lihat {countReplies} Balasan
        </span>
      )}
    </button>
  );
};

const CommentReplyList = () => {
  const { replies, isLoading, query, parentCommentId } = useReplies();
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const router = useRouter();
  const { status } = useSession();
  const { answerId } = useComment();
  const mutationReply = useReplyMutation();

  const handleReplyToReply = useCallback(
    (replyId: string, content: string) => {
      if (status === "unauthenticated") {
        router.replace("/auth/login");
        return;
      }
      mutationReply.mutate(
        {
          answerId: answerId as string,
          parentCommentId: parentCommentId as string,
          replyToCommentId: replyId as string,
          content,
        },
        {
          onSuccess: () => {
            toast.success("Balasan berhasil dikirim");
            setActiveReplyId(null);
          },
        },
      );
    },
    [status, router, mutationReply, answerId, parentCommentId],
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <ul className="ml-4 mt-2 space-y-4">
      {replies.map((reply, i) => (
        <li key={reply.commentId + i} className="flex gap-2">
          <Avatar className="size-8">
            <AvatarImage
              src={
                reply.user.image ||
                "https://ui-avatars.com/api/?name=M&background=2c2c2c&color=ffff"
              }
            />
            <AvatarFallback>&nbsp;</AvatarFallback>
          </Avatar>
          <div className="flex w-full flex-col">
            <div className="flex w-max items-center gap-1">
              <span className="font-bold">{reply.user.name}</span>
              {reply.isOwner && (
                <span className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 shadow-sm">
                  Penulis
                </span>
              )}
              <span className="text-xs font-medium text-muted-foreground">
                • &nbsp;
                {formatDistanceToNow(reply.createdAt, {
                  addSuffix: true,
                  locale: id,
                  includeSeconds: true,
                }).replace(/^\s*\D*?(\d+.*)/, "$1")}
              </span>
            </div>
            <p className="text-sm">
              {reply.replyingTo && (
                <Link
                  prefetch={false}
                  target="_blank"
                  href={`/@${reply.replyingTo.username}`}
                >
                  <span className="mr-1 text-primary">
                    @{reply.replyingTo.username}
                  </span>
                </Link>
              )}
              {reply.content}
            </p>
            <button
              className="text-left text-xs font-semibold"
              onClick={() => {
                if (status === "unauthenticated") {
                  router.replace("/auth/login");
                  return;
                }
                setActiveReplyId(
                  activeReplyId === reply.commentId ? null : reply.commentId,
                );
              }}
            >
              Balas
            </button>
            {activeReplyId === reply.commentId && (
              <ReplyForm
                onSubmit={(content) =>
                  handleReplyToReply(reply.commentId, content)
                }
                onCancel={() => setActiveReplyId(null)}
                replyToUsername={reply.user.username}
              />
            )}
          </div>
        </li>
      ))}
      <InfiniteScroll
        fetchNextPage={query.fetchNextPage}
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        isManual
      />
    </ul>
  );
};
