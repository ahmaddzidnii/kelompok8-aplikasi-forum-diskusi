import { z } from "zod";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { FaCircleInfo } from "react-icons/fa6";
import { zodResolver } from "@hookform/resolvers/zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AutosizeTextarea } from "@/components/ui/textarea-auto-size";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useComment } from "../../hooks/UseComment";
import { useCommentMutation } from "../../hooks/useCommentMutation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { LoadingButton } from "@/components/ui/loading-button";

const formSchema = z.object({
  comment: z.string().max(400),
});

export const CommentInput = () => {
  const { answerId } = useComment();
  const { data, status } = useSession();

  const topLevelCommentMutation = useCommentMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.comment) {
      toast.error("Komentar tidak boleh kosong");
      return;
    }

    topLevelCommentMutation.mutate(
      {
        answerId: answerId as string,
        content: values.comment,
      },
      {
        onSuccess: () => {
          form.reset();
        },
        onError: () => {
          toast.error("Gagal mengirim komentar");
        },
      },
    );
  }

  return (
    <>
      {status === "unauthenticated" ? (
        <Alert variant="destructive">
          <AlertDescription className="flex items-center gap-2 text-sm">
            <FaCircleInfo /> Silakan login/membuat akun untuk berkomentar
          </AlertDescription>
        </Alert>
      ) : (
        <div className="flex gap-2">
          <Avatar className="size-8">
            <AvatarImage src={data?.user.image as string} />
            <AvatarFallback>
              {data?.user.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <AutosizeTextarea
                        className="w-full resize-none rounded-md"
                        placeholder="Tulis komentar..."
                        maxHeight={300}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <LoadingButton
                loading={topLevelCommentMutation.isPending}
                className="mt-2"
                variant="secondary"
                size="sm"
              >
                Kirim
              </LoadingButton>
            </form>
          </Form>
        </div>
      )}
    </>
  );
};
