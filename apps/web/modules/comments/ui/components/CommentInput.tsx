import { FaCircleInfo } from "react-icons/fa6";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AutosizeTextarea } from "@/components/ui/textarea-auto-size";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const CommentInput = () => {
  const { data, status } = useSession();
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
          <div className="w-full">
            <AutosizeTextarea
              className="w-full resize-none rounded-md"
              placeholder="Tulis komentar..."
              maxHeight={300}
            />
            <Button className="mt-2" variant="secondary" size="sm">
              Kirim
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
