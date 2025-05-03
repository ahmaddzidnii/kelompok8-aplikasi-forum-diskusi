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

export const ChangeUsernameButton = () => {
  const [userName, setUserName] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = trpc.settings.changeUsername.useMutation({
    onSuccess: () => {
      toast.success("Username berhasil diubah");
      setUserName("");
      setIsValid(false);
      setIsOpen(false);
      setErrorMessage(null);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    onError: (error) => {
      if (error.data?.code === "CONFLICT") {
        setErrorMessage("Username sudah digunakan");
      } else {
        setErrorMessage(
          "Terjadi kesalahan pada server, silakan coba lagi nanti",
        );
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setUserName(value);

    const regex = /^[a-zA-Z0-9-]+$/; // Only allow alphanumeric characters and underscores
    const isValid = regex.test(value);
    setIsValid(isValid);

    setErrorMessage(null);
    if (!isValid) {
      setErrorMessage(
        "Username hanya boleh mengandung huruf, angka, dan tanda hubung",
      );
    }

    if (value.length < 3 || value.length > 20) {
      setErrorMessage("Username harus terdiri dari 3-20 karakter");
      setIsValid(false);
    }

    if (value.length === 0) {
      setErrorMessage("Username tidak boleh kosong");
      setIsValid(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid) return;

    mutation.mutate({ username: userName });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="mt-2">
          Ubah username
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Ubah username</DialogTitle>
          <DialogDescription>
            Username tidak boleh mengandung spasi, simbol, atau karakter khusus.
          </DialogDescription>
        </DialogHeader>
        <form id="username-form" onSubmit={handleSubmit}>
          <Input
            id="username"
            placeholder="Saya ingin menghapus akun saya"
            className="w-full"
            value={userName}
            onChange={handleChange}
            required
          />
          {errorMessage && (
            <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
          )}
        </form>
        <DialogFooter>
          <Button
            form="username-form"
            disabled={!isValid}
            className="w-full"
            type="submit"
          >
            Ubah username
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
