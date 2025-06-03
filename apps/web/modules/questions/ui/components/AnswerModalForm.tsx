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
import { trpc } from "@/trpc/client";
import { LoadingButton } from "@/components/ui/loading-button";
// import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import { TooltipProvider } from "@/components/ui/tooltip";
import MinimalTiptapThree from "@/components/minimal-tiptap/minimal-tiptap-three";

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
    content: z.string().refine(
      (val) => {
        try {
          const parsed = JSON.parse(val);

          // Basic check
          if (parsed?.type !== "doc" || !Array.isArray(parsed.content)) {
            return false;
          }

          const content = parsed.content;

          // Jika semua paragraph kosong
          const hasNonEmptyParagraph = content.some((node: any) => {
            if (node.type !== "paragraph") return true; // dianggap non-kosong jika bukan paragraph
            if (!Array.isArray(node.content)) return false;
            return node.content.length > 0; // ada isinya
          });

          return hasNonEmptyParagraph;
        } catch {
          return false;
        }
      },
      {
        message: "Jawaban tidak boleh kosong",
      },
    ),
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
        className="flex h-[900px] w-full flex-col"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        {/* Sticky Header */}
        <ResponsiveModalHeader className="sticky top-0 z-10 flex-shrink-0 bg-background pb-4">
          <UserMeta
            avatar={data?.user?.image || "/avatar.png"}
            name={data?.user?.name || "Ahmad Zidni Hidayat"}
            bio=""
            createdAt=""
            username={data?.user?.username || "ahmaddzidnii"}
            withBio={false}
          />

          <p className="mt-4 text-start text-lg font-semibold text-foreground">
            {questionContent || "Judul Pertanyaan"}
          </p>
        </ResponsiveModalHeader>

        {/* Content Area */}
        <div className="flex min-h-0 flex-1 flex-col gap-4 px-0">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex min-h-0 flex-1 flex-col gap-4"
              id="answer-form"
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="flex min-h-0 flex-1 flex-col">
                    <FormControl>
                      <TooltipProvider>
                        {/* <MinimalTiptapEditor
                          placeholder="Tulis jawaban anda.."
                          className="h-full w-full overflow-hidden focus-within:border-foreground"
                          editorContentClassName="p-5 flex-1 overflow-y-auto max-h-[calc(100vh-200px)]"
                          immediatelyRender={false}
                          output="json"
                          autofocus={true}
                          editable={true}
                          editorClassName="focus:outline-none"
                          onChange={(value) => {
                            field.onChange(JSON.stringify(value));
                          }}
                          value={field.value}
                        /> */}
                        <MinimalTiptapThree
                          placeholder="Tulis jawaban anda.."
                          editorClassName="flex-1 w-full  rounded-lg overflow-hidden"
                          editorContentClassName="p-5 overflow-y-auto h-full"
                          immediatelyRender={false}
                          output="json"
                          autofocus
                          editable
                          value={field.value}
                          onChange={(value) => {
                            console.log("onChange", value);
                            field.onChange(JSON.stringify(value));
                          }}
                        />
                      </TooltipProvider>
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
            className="ms-auto flex-shrink-0"
          >
            Kirimkan
          </LoadingButton>
        </div>

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
