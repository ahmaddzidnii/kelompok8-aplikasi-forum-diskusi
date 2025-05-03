"use client";

import { ApplicationLogoWithBrand } from "@/components/ApplicationLogo";
import Link from "next/link";
import { useRouter } from "next/navigation";

const NotFoundPage = () => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  return (
    <>
      <title>404 Not Found</title>
      <div className="flex h-screen flex-col items-center justify-center px-2 md:px-0">
        <img
          className="pointer-events-none"
          src="https://www.gstatic.com/youtube/src/web/htdocs/img/monkey.png"
          alt="png"
        />
        <p className="mt-2 text-center">
          Halaman yang anda cari tidak tersedia. Kami mohon maaf. Coba telusuri
          yang lain.
        </p>
        <div className="my-5">
          <ApplicationLogoWithBrand />
        </div>
        <div className="font-semibold text-blue-400">
          <span onClick={handleBack} className="cursor-pointer hover:underline">
            Kembali
          </span>
          <span className="mx-1 text-primary">•</span>
          <Link className="cursor-pointer hover:underline" href="/">
            Ke Beranda
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
