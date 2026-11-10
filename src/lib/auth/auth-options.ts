import { PrismaAdapter } from "@/src/lib/auth/prisma-adapter";
import type { Account } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  adapter: PrismaAdapter(),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,

      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope:
            "openid email profile https://www.googleapis.com/auth/calendar",
        },
      },

      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          avatar_url: profile.picture,
          username: null,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ account }: { account: Account | null }) {
      if (
        !account?.scope?.includes("https://www.googleapis.com/auth/calendar")
      ) {
        return "/register/connect-calendar?error=permissions";
      }

      return true;
    },
  },
};
