import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { id } from "date-fns/locale";
import { formatDistanceToNow } from "date-fns";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

import { AutosizeTextarea } from "@/components/ui/textarea-auto-size";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useComment } from "../../hooks/UseComment";
import { ReplyProvider } from "../../context/ReplyContext";
import { useReplies } from "../../hooks/useReplies";
import { Loader } from "@/components/Loader";
import { EmptyState } from "@/components/EmptyState";
import { InfiniteScroll } from "@/components/InfiniteScroll";
import { AvatarComponent } from "@/components/AvatarComponent";

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
  const { open, close, isOpen } = useReplies();

  const toggleReplies = () => {
    if (isOpen) {
      close();
    } else {
      open(comment.commentId);
    }
  };

  const handleReplySubmit = (content: string) => {
    // TODO: Implement actual submission logic
    console.log("Submitting reply:", content);
    setIsReplyFormOpen(false);
  };

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

        {/* Button untuk membuka form balasan */}
        <button
          className="text-left text-xs font-semibold"
          onClick={() => {
            if (status === "unauthenticated") {
              router.replace("/auth/login");
              return;
            }
            setIsReplyFormOpen(!isReplyFormOpen);
          }}
        >
          Balas
        </button>

        {/* Form balasan untuk komentar utama */}
        {isReplyFormOpen && (
          <ReplyForm
            onSubmit={handleReplySubmit}
            onCancel={() => setIsReplyFormOpen(false)}
            replyToUsername={comment.user.username}
          />
        )}

        {/* Tombol Balasan hanya ditampilkan jika ada balasan */}
        {hasReplies && (
          <CommentReplyButton
            toggleReplies={toggleReplies}
            countReplies={comment.countReplies}
          />
        )}

        {/* Daftar balasan dengan kemampuan untuk membalas */}
        <CommentReplyList />
      </div>
    </li>
  );
};

// Komponen form untuk membalas komentar
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
      setReplyContent("");
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
  const { replies, isLoading } = useReplies();
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const router = useRouter();
  const { status } = useSession();

  const handleReplyToReply = (
    replyId: string,
    content: string,
    replyToUsername?: string | null,
  ) => {
    // TODO: Implement actual submission logic
    console.log("Submitting reply to reply:", {
      replyId,
      content,
      replyToUsername,
    });
    setActiveReplyId(null);
  };

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

            {/* Form balasan untuk balasan */}
            {activeReplyId === reply.commentId && (
              <ReplyForm
                onSubmit={(content) =>
                  handleReplyToReply(
                    reply.commentId,
                    content,
                    reply.user.username,
                  )
                }
                onCancel={() => setActiveReplyId(null)}
                replyToUsername={reply.user.username}
              />
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

// import Link from "next/link";
// import { useState } from "react";
// import { toast } from "react-toastify";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { FaChevronDown, FaChevronUp } from "react-icons/fa";

// import { AutosizeTextarea } from "@/components/ui/textarea-auto-size";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// type CommentType = {
//   id: number;
//   name: string;
//   time: string;
//   content: string;
//   replies?: Array<{
//     id: number;
//     name: string;
//     time: string;
//     content: string;
//     replyingTo?: { username: string };
//   }>;
// };

// // Komponen form untuk membalas komentar
// const ReplyForm = ({
//   onSubmit,
//   onCancel,
//   replyToUsername,
// }: {
//   onSubmit: (content: string) => void;
//   onCancel: () => void;
//   replyToUsername?: string;
// }) => {
//   const [replyContent, setReplyContent] = useState("");
//   const { status } = useSession();

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (status === "unauthenticated") {
//       toast.error("Silakan login untuk membalas komentar.");
//       return;
//     }

//     if (replyContent.trim()) {
//       onSubmit(replyContent);
//       setReplyContent("");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="mt-2">
//       <div className="flex gap-2">
//         <Avatar className="size-8">
//           <AvatarImage src="https://ui-avatars.com/api/?name=M&background=2c2c2c&color=ffff" />
//           <AvatarFallback>&nbsp;</AvatarFallback>
//         </Avatar>
//         <div className="flex-1">
//           <AutosizeTextarea
//             className="w-full resize-none rounded-md border border-input bg-background p-2 text-sm"
//             placeholder={
//               replyToUsername
//                 ? `Balas ke @${replyToUsername}...`
//                 : "Tulis balasan..."
//             }
//             value={replyContent}
//             onChange={(e) => setReplyContent(e.target.value)}
//             maxHeight={300}
//           />
//           <div className="mt-2 flex justify-end gap-2">
//             <button
//               type="button"
//               onClick={onCancel}
//               className="rounded-md px-3 py-1 text-xs text-muted-foreground hover:bg-muted"
//             >
//               Batal
//             </button>
//             <button
//               type="submit"
//               disabled={!replyContent.trim()}
//               className="rounded-md bg-primary px-3 py-1 text-xs text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
//             >
//               Kirim
//             </button>
//           </div>
//         </div>
//       </div>
//     </form>
//   );
// };

// const CommentReplyList = ({
//   replies,
//   isOpen,
//   onReply,
//   activeReplyId,
//   setActiveReplyId,
// }: {
//   replies: CommentType["replies"];
//   isOpen: boolean;
//   onReply: (replyId: number, content: string, replyToUsername?: string) => void;
//   activeReplyId: number | null;
//   setActiveReplyId: (id: number | null) => void;
// }) => {
//   if (!replies || replies.length === 0 || !isOpen) return null;

//   return (
//     <ul className="ml-4 mt-2 space-y-4">
//       {replies.map((reply) => (
//         <li key={reply.id} className="flex gap-2">
//           <Avatar className="size-8">
//             <AvatarImage
//               src={`https://ui-avatars.com/api/?name=${reply.name.charAt(0)}&background=2c2c2c&color=ffff`}
//             />
//             <AvatarFallback>&nbsp;</AvatarFallback>
//           </Avatar>
//           <div className="flex w-full flex-col">
//             <span className="font-bold">
//               {reply.name}
//               <span className="text-xs font-medium text-muted-foreground">
//                 &nbsp; • {reply.time}
//               </span>
//             </span>
//             <p className="text-sm">
//               {reply.replyingTo && (
//                 <Link
//                   prefetch={false}
//                   target="_blank"
//                   href={`/@${reply.replyingTo.username}`}
//                 >
//                   <span className="mr-1 text-primary">
//                     @{reply.replyingTo.username}
//                   </span>
//                 </Link>
//               )}
//               {reply.content}
//             </p>
//             <button
//               className="text-left text-xs font-semibold"
//               onClick={() => setActiveReplyId(reply.id)}
//             >
//               Balas
//             </button>

//             {/* Form balasan untuk balasan */}
//             {activeReplyId === reply.id && (
//               <ReplyForm
//                 onSubmit={(content) => {
//                   onReply(reply.id, content, reply.replyingTo?.username);
//                   setActiveReplyId(null);
//                 }}
//                 onCancel={() => setActiveReplyId(null)}
//                 replyToUsername={reply.replyingTo?.username}
//               />
//             )}
//           </div>
//         </li>
//       ))}
//     </ul>
//   );
// };

// const CommentReplyButton = ({
//   hasReplies,
//   isOpen,
//   toggleReplies,
// }: {
//   hasReplies: boolean | undefined;
//   isOpen: boolean;
//   toggleReplies: () => void;
// }) => {
//   // Hanya render komponen jika ada balasan
//   if (!hasReplies) return null;

//   return (
//     <button
//       onClick={toggleReplies}
//       className="mt-2 flex w-max justify-start gap-2 ps-0 text-primary"
//     >
//       {isOpen ? (
//         <span className="flex items-center gap-1 text-xs font-semibold">
//           <FaChevronUp size={12} />
//           Tutup Balasan
//         </span>
//       ) : (
//         <span className="flex items-center gap-1 text-xs font-semibold">
//           <FaChevronDown size={12} />
//           Lihat Balasan
//         </span>
//       )}
//     </button>
//   );
// };

// const Comment = ({ comment }: { comment: CommentType }) => {
//   // State untuk mengelola balasan
//   const [isReplyOpen, setIsReplyOpen] = useState(false);
//   const [isReplyFormOpen, setIsReplyFormOpen] = useState(false);
//   const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
//   const [commentReplies, setCommentReplies] = useState(comment.replies || []);

//   // Toggle untuk membuka/menutup balasan
//   const toggleReplies = () => {
//     setIsReplyOpen((prev) => !prev);
//   };

//   // Menambahkan balasan baru ke komentar
//   const handleAddReply = (content: string) => {
//     const newReply = {
//       id: Date.now(), // Menggunakan timestamp sebagai ID sementara
//       name: "User", // Nama pengguna yang sedang login
//       time: "Baru saja",
//       content: content,
//       replyingTo: { username: comment.name.toLowerCase().replace(/\s/g, "") },
//     };

//     setCommentReplies((prev) => [...prev, newReply]);
//     setIsReplyFormOpen(false);

//     // Pastikan balasan terbuka setelah menambahkan balasan
//     if (!isReplyOpen) {
//       setIsReplyOpen(true);
//     }
//   };

//   // Menambahkan balasan ke balasan
//   const handleReplyToReply = (
//     replyId: number,
//     content: string,
//     replyToUsername?: string,
//   ) => {
//     const newReply = {
//       id: Date.now(),
//       name: "User", // Nama pengguna yang sedang login
//       time: "Baru saja",
//       content: content,
//       replyingTo: {
//         username:
//           replyToUsername || comment.name.toLowerCase().replace(/\s/g, ""),
//       },
//     };

//     setCommentReplies((prev) => [...prev, newReply]);
//     console.log(replyId, "commentListFile");
//   };

//   const { status } = useSession();
//   const router = useRouter();

//   // Periksa apakah komentar memiliki balasan
//   const hasReplies = commentReplies.length > 0;

//   return (
//     <li className="flex gap-2">
//       <Avatar className="size-8">
//         <AvatarImage
//           src={`https://ui-avatars.com/api/?name=${comment.name.charAt(0)}&background=2c2c2c&color=ffff`}
//         />
//         <AvatarFallback>&nbsp;</AvatarFallback>
//       </Avatar>
//       <div className="flex w-full flex-col">
//         <span className="font-bold">
//           {comment.name}
//           <span className="text-xs font-medium text-muted-foreground">
//             &nbsp; • {comment.time}
//           </span>
//         </span>
//         <p className="text-sm">{comment.content}</p>

//         {/* Button untuk membuka form balasan */}
//         <button
//           className="text-left text-xs font-semibold"
//           onClick={() => {
//             if (status === "unauthenticated") {
//               router.replace("/auth/login");
//               return;
//             }
//             setIsReplyFormOpen((prev) => !prev);
//           }}
//         >
//           Balas
//         </button>

//         {/* Form balasan untuk komentar utama */}
//         {isReplyFormOpen && (
//           <ReplyForm
//             onSubmit={handleAddReply}
//             onCancel={() => setIsReplyFormOpen(false)}
//           />
//         )}

//         {/* Tombol Balasan hanya ditampilkan jika ada balasan */}
//         <CommentReplyButton
//           hasReplies={hasReplies}
//           isOpen={isReplyOpen}
//           toggleReplies={toggleReplies}
//         />

//         {/* Daftar balasan dengan kemampuan untuk membalas */}
//         <CommentReplyList
//           replies={commentReplies}
//           isOpen={isReplyOpen}
//           onReply={handleReplyToReply}
//           activeReplyId={activeReplyId}
//           setActiveReplyId={setActiveReplyId}
//         />
//       </div>
//     </li>
//   );
// };

// const comments = [
//   {
//     id: 1,
//     name: "Syafiq Rustiawanto",
//     time: "1 jam yang lalu",
//     content: "Ya saya sangat setuju dengan itu!",
//     replies: [
//       {
//         id: 101,
//         name: "Akbar",
//         time: "1 jam yang lalu",
//         content: "sepakat!",
//         replyingTo: { username: "safeq1232" },
//       },
//       {
//         id: 102,
//         name: "Akkbar",
//         time: "1 jam yang lalu",
//         content: "Ya saya sangat setuju dengan itu!",
//         replyingTo: { username: "safeq1232" },
//       },
//       {
//         id: 103,
//         name: "Dwi",
//         time: "1 jam yang lalu",
//         content: "Ya saya sangat setuju dengan itu!",
//         replyingTo: { username: "safeq1232" },
//       },
//     ],
//   },
//   {
//     id: 2,
//     name: "Akkbar",
//     time: "1 jam yang lalu",
//     content: "Ya saya sangat setuju dengan itu!",
//     replies: [
//       {
//         id: 201,
//         name: "Akbar",
//         time: "1 jam yang lalu",
//         content: "Ya saya sangat setuju dengan itu!",
//         replyingTo: { username: "akbar3838" },
//       },
//     ],
//   },
//   {
//     id: 3,
//     name: "Dwi",
//     time: "1 jam yang lalu",
//     content: "Ya saya sangat setuju dengan itu!",
//     replies: [],
//   },
// ];

// export const CommentList = () => {
//   return (
//     <ul className="space-y-4">
//       {comments.map((comment) => (
//         <Comment key={comment.id} comment={comment} />
//       ))}
//     </ul>
//   );
// };
