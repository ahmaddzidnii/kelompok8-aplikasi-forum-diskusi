"use client";
import { z } from "zod";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { useAnswerModalStore } from "@/modules/questions/ui/store/useAnswerModalStore";
import { UserMeta } from "./UserMeta";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/trpc/client";
import { LoadingButton } from "@/components/ui/loading-button";

export const AnswerModalForm = () => {
  const { data, status } = useSession();
  const { questionId, questionContent, isOpen, close } = useAnswerModalStore();
  const router = useRouter();
  const trpcUtils = trpc.useUtils();

  const { mutate, isPending } = trpc.answers.createAnswer.useMutation({
    onSuccess: ({ questionSlug }) => {
      trpcUtils.answers.getMany.invalidate({
        questionSlug,
      });
      toast.success("Jawaban berhasil dikirim");
      handleClose();
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const answerSchema = z.object({
    content: z.string().min(1, { message: "Jawaban tidak boleh kosong" }),
  });

  const form = useForm<z.infer<typeof answerSchema>>({
    resolver: zodResolver(answerSchema),
  });

  const onSubmit = (values: z.infer<typeof answerSchema>) => {
    if (status == "unauthenticated") return;
    if (!questionId) return;

    mutate({
      questionId: questionId,
      content: values.content,
    });
  };
  const handleClose = () => {
    form.reset();
    close();
  };

  return (
    <ResponsiveModal open={isOpen} onOpenChange={handleClose}>
      <ResponsiveModalContent
        side="bottom"
        className="w-full"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <ResponsiveModalHeader>
          <UserMeta
            avatar={data?.user?.image || "/avatar.png"}
            name={data?.user?.name || "Ahmad Zidni Hidayat"}
            bio=""
            createdAt=""
            username={data?.user?.username || "ahmaddzidnii"}
            withBio={false}
          />

          <div className="flex h-[400px] flex-col gap-2">
            <p className="text-lg font-semibold text-foreground">
              {questionContent || "Judul Pertanyaan"}
            </p>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex-1"
                id="answer-form"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="h-full">
                      <FormControl>
                        <Textarea
                          className="h-full resize-none"
                          placeholder="Tulis jawaban anda.."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>

            <LoadingButton
              loading={isPending}
              disabled={!form.formState.isValid}
              type="submit"
              form="answer-form"
              className="ms-auto"
            >
              Kirimkan
            </LoadingButton>
          </div>
        </ResponsiveModalHeader>
        <VisuallyHidden>
          <ResponsiveModalTitle className="sr-only">
            Form Jawaban
          </ResponsiveModalTitle>
          <ResponsiveModalDescription className="sr-only">
            Form untuk menjawab pertanyaan
          </ResponsiveModalDescription>
        </VisuallyHidden>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};
