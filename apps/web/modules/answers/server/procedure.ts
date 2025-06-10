import { createTRPCRouter } from "@/trpc/init";

import { edit } from "./edit";
import { getMany } from "./get";
import { createAnswer } from "./create";
import { deleteAnswer } from "./delete";

export const answersRouter = createTRPCRouter({
  createAnswer,
  getMany,
  edit,
  delete: deleteAnswer,
});
