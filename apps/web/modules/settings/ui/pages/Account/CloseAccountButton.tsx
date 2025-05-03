"use client";

import { useState } from "react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { trpc } from "@/trpc/client";

export const CloseAccountButton = () => {
  const [isMatch, setIsMatch] = useState(false);
  const [confirmation, setConfirmation] = useState<string>("");

  const mutation = trpc.settings.deleteAccount.useMutation({
    onSuccess: () => {
      toast.success("Akun berhasil dihapus.");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleConfirmation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmation(value);
    if (value === "Saya ingin menghapus akun saya") {
      setIsMatch(true);
    } else {
      setIsMatch(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isMatch) {
      mutation.mutate();
    } else {
      toast.error("Teks tidak sesuai, silahkan coba lagi.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" className="mt-2">
          Tutup akun
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Tutup akun</DialogTitle>
          <DialogDescription>
            Apakah anda yakin ingin menutup akun anda?
            <br />
            Tulis ulang &nbsp;
            <b className="text-primary">"Saya ingin menghapus akun saya"</b>
            &nbsp; untuk menutup akun anda.
          </DialogDescription>
        </DialogHeader>
        <form id="confirmation-form" onSubmit={handleSubmit}>
          <Input
            id="confirmation"
            placeholder="Saya ingin menghapus akun saya"
            className="w-full"
            value={confirmation}
            onChange={handleConfirmation}
            required
          />
        </form>
        <DialogFooter>
          <Button
            form="confirmation-form"
            className="w-full"
            disabled={!isMatch || mutation.isPending}
            type="submit"
            variant="destructive"
          >
            {mutation.isPending ? "Loading..." : "Tutup akun"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
