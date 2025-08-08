import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/app/lib/db";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          prompt: "consent select_account",
        },
      },
    }),
  ],

  session: {
    strategy: "jwt", // You’re using JWT sessions
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Add user.id to JWT token
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },

    async signIn({ user }) {
      if (!user.email) return false;

      await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          email: user.email,
          provider: "Google",
        },
      });

      return true;
    },
  },
});

export { handler as GET, handler as POST };
