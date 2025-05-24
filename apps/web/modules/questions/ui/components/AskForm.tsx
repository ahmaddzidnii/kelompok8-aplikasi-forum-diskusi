"use client";

import { z } from "zod";
import { Suspense } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoadingButton } from "@/components/ui/loading-button";
import { AutosizeTextarea } from "@/components/ui/textarea-auto-size";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";

import { trpc } from "@/trpc/client";

import { askFormSchema } from "@/modules/questions/schema";
import { Loader } from "@/components/Loader";
export const AskForm = () => {
  return (
    <Suspense fallback={<Loader />}>
      <ErrorBoundary fallback={<div>Terjadi kesalahan saat memuat form</div>}>
        <AskFormSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};
export const AskFormSuspense = () => {
  const [categories] = trpc.categories.getMany.useSuspenseQuery();
  const { mutate, isPending } = trpc.questions.createQuestion.useMutation();
  const router = useRouter();
  const trpcUtils = trpc.useUtils();

  const OPTIONS: Option[] = categories.map((category) => ({
    label: category.name,
    value: category.categoryId,
  }));

  const form = useForm<z.infer<typeof askFormSchema>>({
    resolver: zodResolver(askFormSchema),
    defaultValues: {
      categories: [],
      questionContent: "",
    },
  });

  function onSubmit(values: z.infer<typeof askFormSchema>) {
    mutate(values, {
      onSuccess: ({ slug }) => {
        form.reset();
        trpcUtils.questions.getMany.invalidate();
        toast.success("Pertanyaan berhasil ditambahkan");
        router.push(`/questions/${slug}`);
      },
      onError: (error) => {
        console.log(error);
        toast.error("Terjadi kesalahan saat menambahkan pertanyaan");
      },
    });
  }
  return (
    <Form {...form}>
      <form className="flex-1 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="categories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori</FormLabel>
              <FormControl>
                <MultipleSelector
                  placeholder="Pilih kategori"
                  options={OPTIONS}
                  value={field.value}
                  onChange={(e) => field.onChange(e)}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="questionContent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori</FormLabel>
              <FormControl>
                <AutosizeTextarea
                  className="w-full resize-none"
                  placeholder="Mulailah pertanyaan Anda dengan 'Apa', 'Bagaimana', 'Mengapa', dll."
                  maxHeight={300}
                  minHeight={200}
                  value={field.value}
                  onChange={(e) => field.onChange(e)}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-5 flex md:justify-end">
          <LoadingButton
            loading={isPending}
            className="w-full md:w-auto"
            size="sm"
            type="submit"
          >
            Tambah pertanyaan
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
};
