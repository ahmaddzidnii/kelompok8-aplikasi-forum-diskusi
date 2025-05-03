"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import { LoaderIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/trpc/client";

import { settingsProfileFormSchema } from "./schema";

export const ProfileForm = () => {
  return (
    <Suspense
      fallback={
        <div className="h-[300px]">
          <LoaderIcon className="size-7 animate-spin" />
        </div>
      }
    >
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <ProfileFormSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const ProfileFormSuspense = () => {
  const [user] = trpc.settings.getProfile.useSuspenseQuery();
  const mutation = trpc.settings.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile berhasil diperbarui!");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    onError: (error) => {
      if (error.data?.code === "INTERNAL_SERVER_ERROR") {
        toast.error("Terjadi masalah pada server!");
      } else {
        toast.error("Gagal saat mengupdate profile!");
      }
    },
  });

  const form = useForm<z.infer<typeof settingsProfileFormSchema>>({
    resolver: zodResolver(settingsProfileFormSchema),
    defaultValues: {
      name: user.name || "",
      bio: user.bio || "",
      location: user.location || "",
      organization: user.organization || "",
    },
  });

  async function onSubmit(values: z.infer<typeof settingsProfileFormSchema>) {
    if (!form.formState.isDirty || mutation.isPending) return;
    mutation.mutate(values);
  }
  return (
    <Form {...form}>
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="grid gap-1">
              <FormLabel htmlFor="name">Nama</FormLabel>
              <FormControl>
                <Input
                  id="name"
                  placeholder="John Doe"
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location Field */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="grid gap-1">
              <FormLabel htmlFor="location">Lokasi</FormLabel>
              <FormControl>
                <Input
                  id="location"
                  placeholder="Jakarta, Indonesia"
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Organization Field */}
        <FormField
          control={form.control}
          name="organization"
          render={({ field }) => (
            <FormItem className="grid gap-1">
              <FormLabel htmlFor="location">Organisasi</FormLabel>
              <FormControl>
                <Input
                  id="location"
                  placeholder="PT. XYZ Indonesia"
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bio Field */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="grid gap-1">
              <FormLabel htmlFor="bio">Bio</FormLabel>
              <FormControl>
                <Textarea
                  id="bio"
                  placeholder="Jelaskan siapa Anda dan apa yang Anda lakukan"
                  autoComplete="off"
                  className="h-24 resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={
            !form.formState.isDirty ||
            mutation.isPending ||
            !form.formState.isValid
          }
        >
          Perbarui Profil
        </Button>
      </form>
    </Form>
  );
};
