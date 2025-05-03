import React from "react";
import Link from "next/link";

import Truncate from "@/components/Truncate";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AnswersPage = () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Input type="text" placeholder="Cari jawaban..." className="w-full" />
        <Button className="ml-3">Filter</Button>
      </div>
      <ul className="flex flex-col gap-3">
        {Array.from({ length: 10 }).map((_, index) => (
          <li key={index} className="flex flex-col gap-3 border-t px-2.5 py-3">
            <div className="flex">
              <Avatar>
                <AvatarImage />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <div className="ml-2 flex flex-col justify-center">
                <p className="text-sm font-bold">Cinta Nusa</p>
                <p className="text-xs text-muted-foreground">2 jam yang lalu</p>
              </div>
            </div>
            <div>
              <Link href="#" className="mb-2 font-bold hover:underline">
                Mengapa terkadang dinas-dinas ataupun orang-orang kaya di
                Indonesia lebih memilih Mercedes Benz daripada memilih Lexus?
              </Link>

              <Truncate typeExpand="normal" maxHeight={100}>
                <p>
                  Mercedes Benz itu full CKD di Indonesia, sedangkan Lexus full
                  CBU.
                </p>

                <p>
                  Lexus yang biaya perawatannya murah dan sparepartnya
                  terjangkau, adalah Lexus yang punya platform serupa dengan
                  Toyota.
                </p>

                <p>
                  Coba pelihara Lexus LS, bandingkan dengan Mercedes Benz
                  S-Class, apa sparepartnya memang semudah yang dianggap
                  masyarakat selama ini.
                </p>
              </Truncate>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default AnswersPage;
