import { Loader } from "@/components/Loader";
import { useComment } from "../../hooks/UseComment";
import { CommentFilter } from "./CommentFilter";
import { CommentInput } from "./CommentInput";
import { CommentList } from "./CommentList";
import { InternalServerError } from "@/components/InternalServerErrorFallback";

export const CommentView = () => {
  const { isLoading, isError } = useComment();

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <InternalServerError />;
  }

  return (
    <div className="flex flex-col gap-4">
      <CommentInput />
      <CommentFilter />
      <CommentList />
    </div>
  );
};
