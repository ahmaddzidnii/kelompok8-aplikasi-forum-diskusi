import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "./ProfileForm";

export const ProfilePage = () => {
  return (
    <div>
      <h2 className="text-2xl">Profil Anda</h2>
      <Separator className="my-2" />
      <ProfileForm />
    </div>
  );
};
