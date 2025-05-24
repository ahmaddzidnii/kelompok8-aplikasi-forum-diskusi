import Link from "next/link";

import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";

import { useUserVoteListModal } from "../../hooks/useUserVoteListModal";
import { trpc } from "@/trpc/client";
import { InternalServerError } from "@/components/InternalServerErrorFallback";
import { Loader } from "@/components/Loader";
import { EmptyState } from "@/components/EmptyState";

export const UserVoteListModal = () => {
  const { answerId, isOpen, reset } = useUserVoteListModal();

  const handleClose = () => {
    reset();
  };

  const {
    data: usersVotes,
    isLoading,
    isError,
    error,
    refetch,
  } = trpc.votes.getListUserVoteByAnswerId.useQuery(
    { answerId: answerId || "" },
    {
      enabled: Boolean(answerId && isOpen),
      retry: 1,
      staleTime: 1000 * 30,
    },
  );

  let content = null;

  if (isLoading) {
    content = <Loader />;
  } else if (isError) {
    content = (
      <div className="flex flex-col items-center justify-center p-4">
        <InternalServerError />
        <button
          onClick={() => refetch()}
          className="mt-2 rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
        >
          Coba Lagi
        </button>
        {error?.message && (
          <p className="mt-1 text-xs text-red-500">{error.message}</p>
        )}
      </div>
    );
  } else if (usersVotes && usersVotes.length > 0) {
    content = (
      <ul className="max-h-96 overflow-y-auto">
        {usersVotes.map((user) => (
          <li
            key={user.id}
            className="flex items-center gap-2 p-2 hover:bg-gray-100"
          >
            <img
              src={user.image}
              alt={user.name}
              className="h-8 w-8 rounded-full"
            />
            <div>
              <Link
                href={`/profile/${user.username}`}
                className="font-semibold text-blue-600 hover:underline"
              >
                {user.name}
              </Link>
              <p className="text-sm text-gray-500">@{user.username}</p>
            </div>
          </li>
        ))}
      </ul>
    );
  } else {
    content = <EmptyState />;
  }

  return (
    <ResponsiveModal open={isOpen} onOpenChange={handleClose}>
      <ResponsiveModalContent>
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>
            Orang yang mendukung jawaban ini
          </ResponsiveModalTitle>
          <ResponsiveModalDescription>&nbsp;</ResponsiveModalDescription>
        </ResponsiveModalHeader>
        {content}
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};
