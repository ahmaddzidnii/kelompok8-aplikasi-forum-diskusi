import { auth } from "@/auth";
import { redirect } from "next/navigation";

interface SettingsPageGuardProps {
  children: React.ReactNode;
}

const SettingsPageGuard = async ({ children }: SettingsPageGuardProps) => {
  const session = await auth();

  const cbUrl = btoa("/settings/profile");

  if (!session) redirect(`/auth/login?next=${cbUrl}`);

  return <>{children}</>;
};

export default SettingsPageGuard;
