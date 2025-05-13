import { settingsRouter } from "@/modules/settings/server/procedures";
import { usersRouter } from "@/modules/user-profile/server/procedures";
import { questionsRouter } from "@/modules/questions/server/procedure";
import { categoriesRouter } from "@/modules/categories/server/procedures";

import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  settings: settingsRouter,
  categories: categoriesRouter,
  users: usersRouter,
  questions: questionsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
