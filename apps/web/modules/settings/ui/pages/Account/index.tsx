import { Separator } from "@/components/ui/separator";
import { CloseAccountButton } from "./CloseAccountButton";
import { ChangeUsernameButton } from "./ChangeUsernameButton";

export const AccountSettingsPage = () => {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl">Ubah username</h2>
        <Separator className="my-2" />
        <p className="text-base">
          Ubah username anda untuk mengubah nama pengguna yang akan terlihat di
          aplikasi dan di halaman profil anda.
        </p>
        <ChangeUsernameButton />
      </div>
      <div>
        <h2 className="text-2xl text-destructive">Tutup akun</h2>
        <Separator className="my-2" />
        <p className="text-base">
          Anda yakin akan menutup akun? tindakan ini tidak bisa dibatalkan.
        </p>
        <CloseAccountButton />
      </div>
    </div>
  );
};
