import Link from "next/link";
// import { ChevronDownIcon } from "lucide-react";

import logger from "@/lib/logger";
import Truncate from "@/components/Truncate";
// import { Button } from "@/components/ui/button";
// import { ContributionGraph } from "@/modules/user-profile/ui/components/ContributionGraph";

interface PageProps {
  params: {
    userId: string;
  };
}

const Page = ({ params }: PageProps) => {
  logger.info(JSON.stringify(params));
  return (
    <div className="w-full space-y-5">
      <div className="w-full space-y-3">
        <div>
          <p className="mb-2 text-base">Pertanyaan terakhir yang diajukan</p>
          <ul className="grid grid-cols-1 gap-x-2 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <li
                key={index}
                className="mb-3 min-h-20 w-full overflow-hidden rounded-md border p-2"
              >
                <Link
                  href="#"
                  className="line-clamp-3 break-words font-bold hover:underline"
                >
                  Mengapa terkadang dinas-dinas ataupun orang-orang kaya di
                  Indonesia lebih memilih Mercedes Benz daripada memilih Lexus?
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 text-base">Pertanyaan terakhir yang dijawab</p>
          <ul className="grid grid-cols-1 gap-x-2 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <li key={index} className="mb-3 w-full rounded-md border p-4">
                <Link href="#" className="mb-2 font-bold hover:underline">
                  Mengapa terkadang dinas-dinas ataupun orang-orang kaya di
                  Indonesia lebih memilih Mercedes Benz daripada memilih Lexus?
                </Link>

                <Truncate
                  typeExpand="link"
                  linkHref="/questions/123"
                  maxHeight={80}
                >
                  <p>
                    Mercedes Benz itu full CKD di Indonesia, sedangkan Lexus
                    full CBU.
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
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* <div className="flex w-full">
        <div className="w-full lg:w-5/6">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-base">1,539 contributions in the last year</p>
            <Button className="lg:hidden" variant="outline" size="sm">
              Year:&nbsp;2025 <ChevronDownIcon />
            </Button>
          </div>
          <div className="rounded-md border p-2">
            <ContributionGraph />
          </div>
        </div>
        <div className="hidden w-1/6 shrink-0 lg:block">
          <div className="flex flex-col gap-2 pl-8">
            <Button className="justify-start">2025</Button>
            <Button variant="ghost" className="justify-start">
              2024
            </Button>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Page;
