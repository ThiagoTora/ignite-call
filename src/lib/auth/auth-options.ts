import { PrismaAdapter } from "@/src/lib/auth/prisma-adapter";
import type { Account, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "../prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(),
  session: { strategy: "database" },

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

  events: {
    async createUser({ user }) {
      await prisma.userTimeInterval.createMany({
        data: [1, 2, 3, 4, 5].map((weekDay) => ({
          week_day: weekDay,
          time_start_in_minutes: 480,
          time_end_in_minutes: 1080,
          user_id: user.id,
        })),
      });
    },
  },

  callbacks: {
    async signIn({ account }: { account: Account | null }) {
      if (
        !account?.scope?.includes("https://www.googleapis.com/auth/calendar")
      ) {
        return "/register/connect-calendar?error=permissions";
      }

      return true;
    },

    async session({ session, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          username: user.username,
          avatar_url: user.avatar_url,
        },
      };
    },
  },
};
