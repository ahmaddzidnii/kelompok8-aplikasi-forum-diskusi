import { settingsRouter } from "@/modules/settings/server/procedures";
import { usersRouter } from "@/modules/user-profile/server/procedures";
import { questionsRouter } from "@/modules/questions/server/procedure";
import { categoriesRouter } from "@/modules/categories/server/procedures";
import { answersRouter } from "@/modules/answers/server/procedure";

import { createTRPCRouter } from "../init";
import { votesRouter } from "@/modules/votes/server/procedure";

export const appRouter = createTRPCRouter({
  settings: settingsRouter,
  categories: categoriesRouter,
  users: usersRouter,
  questions: questionsRouter,
  answers: answersRouter,
  votes: votesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
