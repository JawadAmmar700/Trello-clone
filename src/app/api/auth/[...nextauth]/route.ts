import { env } from "@/lib/env-helper";
import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { DefaultAdapter } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: env.SECRET,
  adapter: PrismaAdapter(prisma) as DefaultAdapter,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user = {
          name: token.name,
          email: token.email,
          image: token.picture,
          id: token.sub,
        };
      }
      return session;
    },
    async redirect() {
      return "/";
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  jwt: {
    secret: env.JWT_SECRET,
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
