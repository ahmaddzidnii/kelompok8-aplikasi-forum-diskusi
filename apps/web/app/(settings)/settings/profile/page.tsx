import { Metadata } from "next";

import { HydrateClient, trpc } from "@/trpc/server";
import { ProfilePage } from "@/modules/settings/ui/pages/Profile";

export const metadata: Metadata = {
  title: "Pengaturan profile",
};

export const dynamic = "force-dynamic"; // Revalidate this page on every request

const SettingsProfile = () => {
  void trpc.settings.getProfile.prefetch();
  return (
    <HydrateClient>
      <ProfilePage />
    </HydrateClient>
  );
};

export default SettingsProfile;
