import { CiCircleInfo } from "react-icons/ci";

import { Card, CardContent } from "@/components/ui/card";
import { AvatarComponent } from "@/components/AvatarComponent";

import { auth } from "@/auth";
import { AskForm } from "../components/AskForm";

export const AskQuestionView = async () => {
  const session = await auth();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Ajukan Pertanyaan</h1>
      <Card>
        <CardContent className="space-y-4 py-3.5">
          <div className="flex items-center gap-2">
            <CiCircleInfo className="size-10" />
            <span className="text-base font-semibold md:text-[20px]">
              Tips untuk Mengajukan Pertanyaan yang Baik!
            </span>
          </div>
          <ul className="list-disc pl-5 text-sm md:text-base">
            <li>
              Pastikan pertanyaan Anda belum pernah ditanyakan sebelumnya.
            </li>
            <li>Buatlah pertanyaan yang singkat, jelas, dan spesifik.</li>
            <li>Periksa tata bahasa dan ejaan.</li>
          </ul>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <AvatarComponent
          size="lg"
          alt={session?.user.name as string}
          src={session?.user.image as string}
          fallback={session?.user.name?.charAt(0).toUpperCase()}
        />
        <AskForm />
      </div>
    </div>
  );
};
