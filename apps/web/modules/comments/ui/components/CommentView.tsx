import { CommentFilter } from "./CommentFilter";
import { CommentInput } from "./CommentInput";
import { CommentList } from "./CommentList";

export const CommentView = () => {
  return (
    <div className="flex flex-col gap-4">
      <CommentInput />
      <CommentFilter />
      <CommentList />
    </div>
  );
};
