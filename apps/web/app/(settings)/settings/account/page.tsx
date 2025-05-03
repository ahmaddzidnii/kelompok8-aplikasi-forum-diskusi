import { AccountSettingsPage } from "@/modules/settings/ui/pages/Account";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pengaturan akun",
};

const page = () => {
  return <AccountSettingsPage />;
};

export default page;
