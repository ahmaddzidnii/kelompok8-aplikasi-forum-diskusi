import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "react-toastify";
import { FaChevronDown, FaChevronUp, FaFlag } from "react-icons/fa";
import { IoMdMore } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";

import { AutosizeTextarea } from "@/components/ui/textarea-auto-size";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AvatarComponent } from "@/components/AvatarComponent";
import { Loader } from "@/components/Loader";
import { EmptyState } from "@/components/EmptyState";
import { InfiniteScroll } from "@/components/InfiniteScroll";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useComment } from "@/modules/comments/hooks/UseComment";
import { useReplies } from "@/modules/comments/hooks/useReplies";
import { useReplyMutation } from "@/modules/comments/hooks/useReplyMutation";
import { ReplyProvider } from "@/modules/comments/context/ReplyContext";
import { hasPermission } from "../../server/utils";
import { Comment as CommentType } from "../../context/CommentContext";
import { cn } from "@/lib/utils";

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

  const options = useMemo(() => {
    type OptionType = {
      label: string;
      icon: React.ElementType;
      action: () => void;
    };
    return [
      hasPermission(comment.permissions, "CAN_EDIT") && {
        label: "Edit",
        icon: MdEdit,
        action: () => {
          toast.error("Fitur edit komentar belum tersedia");
        },
      },
      hasPermission(comment.permissions, "CAN_DELETE") && {
        label: "Hapus",
        icon: FaRegTrashCan,
        action: () => {
          toast.error("Fitur hapus komentar belum tersedia");
        },
      },
      hasPermission(comment.permissions, "CAN_REPORT") && {
        label: "Laporkan",
        icon: FaFlag,
        action: () => {
          toast.error("Fitur lapor komentar belum tersedia");
        },
      },
    ].filter(Boolean) as OptionType[];
  }, [comment.permissions]);

  return (
    <li className="flex flex-col gap-2">
      <div className="flex w-full min-w-0">
        <Avatar className="size-8 shrink-0">
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
        <div className="ml-2 flex w-full min-w-0 flex-col">
          <div className="flex min-w-0 flex-wrap items-center gap-1">
            <span
              className={cn(
                "max-w-[120px] truncate font-bold sm:max-w-none",
                comment.isOwner &&
                  "rounded-lg border bg-[#24232388] px-2 py-0.5 text-xs font-medium text-background",
              )}
            >
              {comment.user.name}
            </span>
            <span className="truncate text-xs font-medium text-muted-foreground">
              • &nbsp;
              {formatDistanceToNow(comment.createdAt, {
                addSuffix: true,
                locale: id,
                includeSeconds: true,
              }).replace(/^\s*\D*?(\d+.*)/, "$1")}{" "}
              {comment.isEdited && " (diedit)"}
            </span>
          </div>

          <p className="break-words text-sm">{comment.content}</p>

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
        </div>
        {status === "authenticated" && (
          <div className="mx-auto shrink-0">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="[&_svg]:size-5">
                  <IoMdMore />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {options.map(({ action, icon: Icon, label }, index) => (
                  <DropdownMenuItem key={index} className="px-2.5 py-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start p-0 [&_svg]:size-5"
                      onClick={() => {
                        action();
                      }}
                    >
                      <Icon />
                      <span className="ms-2">{label}</span>
                    </Button>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      <CommentReplyList />
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

  // Memoize options per reply to avoid re-creating on every render
  const getReplyOptions = useCallback((reply: any) => {
    return [
      hasPermission(reply.permissions, "CAN_EDIT") && {
        label: "Edit",
        icon: MdEdit,
        action: () => {
          toast.error("Fitur edit komentar belum tersedia");
        },
      },
      hasPermission(reply.permissions, "CAN_DELETE") && {
        label: "Hapus",
        icon: FaRegTrashCan,
        action: () => {
          toast.error("Fitur hapus komentar belum tersedia");
        },
      },
      hasPermission(reply.permissions, "CAN_REPORT") && {
        label: "Laporkan",
        icon: FaFlag,
        action: () => {
          toast.error("Fitur lapor komentar belum tersedia");
        },
      },
    ].filter(Boolean) as {
      label: string;
      icon: React.ElementType;
      action: () => void;
    }[];
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <ul className="ml-4 mt-2 space-y-4">
      {replies.map((reply, i) => {
        const options = getReplyOptions(reply);

        return (
          <li key={reply.commentId + i} className="flex w-full min-w-0">
            <Avatar className="size-8 shrink-0">
              <AvatarImage
                src={
                  reply.user.image ||
                  "https://ui-avatars.com/api/?name=M&background=2c2c2c&color=ffff"
                }
              />
              <AvatarFallback>&nbsp;</AvatarFallback>
            </Avatar>
            <div className="ml-2 flex w-full min-w-0 flex-col">
              <div className="flex min-w-0 flex-wrap items-center gap-1">
                <span
                  className={cn(
                    "max-w-[120px] truncate font-bold sm:max-w-none",
                    reply.isOwner &&
                      "rounded-lg border bg-[#24232388] px-2 py-0.5 text-xs font-medium text-background",
                  )}
                >
                  {reply.user.name}
                </span>

                <span className="truncate text-xs font-medium text-muted-foreground">
                  • &nbsp;
                  {formatDistanceToNow(reply.createdAt, {
                    addSuffix: true,
                    locale: id,
                    includeSeconds: true,
                  }).replace(/^\s*\D*?(\d+.*)/, "$1")}
                  {reply.isEdited && " (diedit)"}
                </span>
              </div>
              <p className="break-words text-sm">
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
            {status === "authenticated" && (
              <div className="mx-auto shrink-0">
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="[&_svg]:size-5"
                    >
                      <IoMdMore />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {options.map(({ action, icon: Icon, label }, index) => (
                      <DropdownMenuItem key={index} className="px-2.5 py-1">
                        <Button
                          variant="ghost"
                          className="w-full justify-start p-0 [&_svg]:size-5"
                          onClick={action}
                        >
                          <Icon />
                          <span className="ms-2">{label}</span>
                        </Button>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </li>
        );
      })}
      <InfiniteScroll
        fetchNextPage={query.fetchNextPage}
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        isManual
      />
    </ul>
  );
};
