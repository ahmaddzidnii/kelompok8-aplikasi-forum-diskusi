"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";

import { config } from "@/config";
import { Button } from "@/components/ui/button";
import Typewriter from "@/components/TypeWriter";
import { ApplicationLogoWithBrand } from "@/components/ApplicationLogo";

interface LoginPageProps {
  searchParams: { next?: string };
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const callbackUrl = searchParams.next
    ? atob(searchParams.next)
    : config.defaultRedrictAfterLoginUrl;

  const handleSocialLogin = (provider: "google" | "github") => {
    signIn(provider, {
      redirectTo: callbackUrl,
    });
  };

  return (
    <div>
      <div className="flex min-h-screen">
        {/* Left side - Login form */}
        <div className="flex w-full flex-col justify-center px-8 md:px-16 lg:w-1/2 lg:px-24">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8">
              <ApplicationLogoWithBrand />
            </div>

            <h2 className="mb-2 text-3xl font-bold">Login Akun</h2>
            <p className="mb-8 text-gray-500">
              Selamat datang kembali, Login untuk melanjutkan.
            </p>

            <div className="space-y-4">
              <Button
                variant="outline"
                className="h-12 w-full justify-center gap-2 [&_svg]:size-7"
                onClick={() => handleSocialLogin("google")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="100"
                  height="100"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  ></path>
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  ></path>
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                </svg>
                Lanjutkan dengan Google
              </Button>

              <Button
                variant="outline"
                className="h-12 w-full justify-center gap-2 [&_svg]:size-7"
                onClick={() => handleSocialLogin("github")}
              >
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>GitHub</title>
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                Lanjutkan dengan Github
              </Button>
            </div>
          </div>
        </div>

        {/* Right side - Hero image */}
        <div className="relative hidden lg:block lg:w-1/2">
          <div className="absolute inset-0 z-10 bg-black/20"></div>
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-12 text-primary-foreground">
            <div className="max-w-md text-center">
              <h2 className="mb-6 text-5xl font-bold">
                <Typewriter
                  text="Temukan Jawaban, Mulai Diskusi."
                  pauseDuration={3000}
                  deletingSpeed={100}
                  typingSpeed={200}
                />
              </h2>
            </div>
          </div>
          <Image
            src="/hero-login.jpg"
            alt="hero"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}
