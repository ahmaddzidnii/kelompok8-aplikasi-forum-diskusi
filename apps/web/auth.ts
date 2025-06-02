import { type Role } from "@prisma/client";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import NextAuth, { DefaultSession, User } from "next-auth";

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
      if (message.isNewUser && message.user.email) {
        await handleUpdateToInitialProfile(message.user);
      }

      if (message.isNewUser && message.user.image && message.user.id) {
        await handleAvatarUpload(message.user, message.user.image!);
      }
    },
  },
});

const handleUpdateToInitialProfile = async (user: User): Promise<void> => {
  await prisma.user.update({
    where: { id: user.id },
    data: {
      username: generateFromEmail(user.email || "ahmad@gmail.com", 3),
      organization: "Komunitas Forumdiskusi.",
    },
  });
};

const handleAvatarUpload = async (
  user: User,
  imageUrl: string,
): Promise<void> => {
  const key = `profile/${user.id}.jpg`;
  const image = await uploadToCustomS3(imageUrl!, key);

  await prisma.$transaction(async (tx) => {
    const { imageId } = await tx.image.create({
      data: {
        key,
        url: image,
        type: "AVATAR",
      },
      select: {
        imageId: true,
      },
    });

    await tx.user.update({
      where: { id: user.id },
      data: {
        image,
        images: {
          connect: {
            imageId: imageId,
          },
        },
      },
    });

    await tx.image.update({
      where: { imageId },
      data: {
        isUsed: true,
      },
    });
  });
};
