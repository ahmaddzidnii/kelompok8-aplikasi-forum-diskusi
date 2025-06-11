import { notFound } from "next/navigation";

import { trpc } from "@/trpc/server";
import { Footer } from "@/components/Footer";

import "@/modules/user-profile/ui/styles/profile.css";

import logger from "@/lib/logger";
import { UserPageNavbar } from "../components/UserPageNavbar";
import { UserPageSidebar } from "../components/UserPageSidebar";

interface UserProfileLayoutProps {
  children: React.ReactNode;
  username: string;
}

export const UserProfileLayout = async ({
  children,
  username,
}: UserProfileLayoutProps) => {
  const getOneUserPromise = trpc.users.getOneUser({ username });
  const getCountNavbarPromise = trpc.users.getCountNavbar({
    username,
  });

  const [resultGetOneUser, resultGetCountNavbar] = await Promise.allSettled([
    getOneUserPromise,
    getCountNavbarPromise,
  ]);

  let user;
  let countNavbar;

  if (resultGetOneUser.status === "fulfilled") {
    user = resultGetOneUser.value;
  } else {
    const error = resultGetOneUser.reason.code;
    if (error === "NOT_FOUND") {
      logger.warn(
        `User dengan username ${username} tidak ditemukan! Mengalihkan ke halaman 404`,
      );
    } else if (error === "INTERNAL_SERVER_ERROR") {
      logger.error(
        `Gagal mengambil data user ${JSON.stringify((resultGetOneUser as PromiseRejectedResult).reason)}`,
      );
    } else {
      logger.error(
        `Gagal mengambil data user ${JSON.stringify((resultGetOneUser as PromiseRejectedResult).reason)}`,
      );
    }
    return notFound();
  }

  if (resultGetCountNavbar.status === "fulfilled") {
    countNavbar = resultGetCountNavbar.value;
  } else {
    logger.error(resultGetCountNavbar.reason);
  }

  return (
    <>
      <UserPageNavbar
        username={user!.username}
        countAnswer={countNavbar?.answerCount}
        countQuestion={countNavbar?.questionCount}
      />
      <div className="mx-auto w-full max-w-[1216px] px-2 pt-5">
        <div className="Layout Layout--flowRow-until-md min-h-screen">
          <aside className="Layout-sidebar w-full shrink-0">
            <UserPageSidebar user={user} />
          </aside>
          <main className="Layout-main space-y-5">{children}</main>
        </div>
      </div>
      <Footer />
    </>
  );
};
