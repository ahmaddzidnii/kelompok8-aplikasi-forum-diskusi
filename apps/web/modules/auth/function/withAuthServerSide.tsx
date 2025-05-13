import "server-only";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { config } from "@/config";

export const withAuthServerSide = <P extends Record<string, any>>(
  Component: React.ComponentType<P>,
) => {
  const AuthComponent = async (props: P) => {
    const session = await auth();

    if (!session?.user) {
      redirect(config.loginRoute);
    }

    return <Component {...props} />;
  };

  return AuthComponent;
};
