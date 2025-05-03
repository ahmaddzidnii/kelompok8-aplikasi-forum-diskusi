import { categoriesRouter } from "@/modules/categories/server/procedures";
import { createTRPCRouter } from "../init";
import { settingsRouter } from "@/modules/settings/server/procedures";
import { usersRouter } from "@/modules/user-profile/server/procedures";

export const appRouter = createTRPCRouter({
  settings: settingsRouter,
  categories: categoriesRouter,
  users: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
