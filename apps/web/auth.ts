import { type Role } from "@prisma/client";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import NextAuth, { DefaultSession } from "next-auth";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { generateFromEmail } from "unique-username-generator";

import { prisma } from "@/lib/prisma";
import { uploadToCustomS3 } from "./lib/image-processing";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user username */
      username: string;
      role: Role;

      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    Google({
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
    Github,
  ],
  callbacks: {
    // async jwt({ token, user, trigger }) {
    //   if (trigger === "signUp" && user.email && user.id) {
    //     await prisma.user.update({
    //       where: { id: user.id },
    //       data: {
    //         username: generateFromEmail(user.email, 3),
    //       },
    //     });
    //   }
    //   return {
    //     sub: token.sub,
    //   };
    // },
    async session({ session }) {
      return session;
      // if (!token.sub) return session;

      // const existingUser = await prisma.user.findUnique({
      //   where: { id: token.sub },
      // });

      // if (!existingUser) return session;

      // return {
      //   ...session,
      //   user: {
      //     id: token.sub as string,
      //     username: existingUser.username,
      //     email: existingUser.email,
      //     image: existingUser.image,
      //     name: existingUser.name,
      //   },
      // };
    },
  },
  events: {
    async signIn(message) {
      if (message.isNewUser) {
        const imageUrl = message.user.image;

        const image = await uploadToCustomS3(
          imageUrl!,
          `profile/${message.user.id}.jpg`,
        );

        await prisma.user.update({
          where: { id: message.user.id },
          data: {
            username: generateFromEmail(message.user.email!, 3),
            organization: "Komunitas Forumdiskusi.",
            image,
          },
        });
      }
    },
  },
});
