import { auth } from "@/auth";
import { redirect } from "next/navigation";

interface AuthPageGuardProps {
  children: React.ReactNode;
}

const AuthPageGuard = async ({ children }: AuthPageGuardProps) => {
  const session = await auth();

  if (session) redirect("/@ahmaddzidnii");

  return <>{children}</>;
};

export default AuthPageGuard;
