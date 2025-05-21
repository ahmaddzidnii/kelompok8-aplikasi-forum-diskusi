import { useContext } from "react";

import { ReplyContext } from "../context/ReplyContext";

export const useReplies = () => {
  const context = useContext(ReplyContext);

  if (!context) {
    throw new Error("useComment must be used within a ReplyProvider");
  }

  return context;
};
