"use client";

import { z } from "zod";
import { Suspense } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { ErrorBoundary } from "react-error-boundary";
import { zodResolver } from "@hookform/resolvers/zod";

import { InternalServerError } from "@/components/InternalServerErrorFallback";
import { Loader } from "@/components/Loader";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";
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
import { askFormSchema } from "../../schema";
import { useEditQuestionModal } from "../../hooks/useEditQuestionModal";

export const EditQuestionModal = () => {
  const { isOpen, reset, slug } = useEditQuestionModal();

  const handleClose = () => {
    reset();
  };

  return (
    <ResponsiveModal open={isOpen} onOpenChange={handleClose}>
      <ResponsiveModalContent onPointerDownOutside={(e) => e.preventDefault()}>
        <ResponsiveModalTitle>Edit pertanyaan</ResponsiveModalTitle>
        <Suspense fallback={<Loader />}>
          <ErrorBoundary fallback={<InternalServerError />}>
            {isOpen && slug ? <EditQuestionFormSuspense /> : null}
            <ResponsiveModalHeader>
              <ResponsiveModalDescription>&nbsp;</ResponsiveModalDescription>
            </ResponsiveModalHeader>
          </ErrorBoundary>
        </Suspense>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

const EditQuestionFormSuspense = () => {
  const { slug, reset } = useEditQuestionModal();
  const [categories] = trpc.categories.getMany.useSuspenseQuery();
  const [questionQuery] = trpc.questions.getOne.useSuspenseQuery({
    slug: slug || "",
  });
  const trpcUtils = trpc.useUtils();

  const form = useForm<z.infer<typeof askFormSchema>>({
    resolver: zodResolver(askFormSchema),
    defaultValues: {
      categories: questionQuery.questionCategories.map((category) => ({
        label: category.category.name,
        value: category.category.categoryId,
      })),
      questionContent: questionQuery.content,
    },
  });

  const updateQuestionMutation = trpc.questions.edit.useMutation({
    onSuccess: () => {
      toast.success("Pertanyaan berhasil diperbarui");
      form.reset();
      reset();
      trpcUtils.questions.invalidate();
      trpcUtils.categories.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Gagal memperbarui pertanyaan");
    },
  });

  const OPTIONS: Option[] = categories.map((category) => ({
    label: category.name,
    value: category.categoryId,
  }));

  function onSubmit(values: z.infer<typeof askFormSchema>) {
    updateQuestionMutation.mutate({
      slug: slug || "",
      categories: values.categories,
      questionContent: values.questionContent,
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
            loading={updateQuestionMutation.isPending}
            className="w-full md:w-auto"
            size="sm"
            disabled={!form.formState.isDirty}
            type="submit"
          >
            Edit pertanyaan
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
};
