import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const googleConfigured = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export const authConfig = {
  providers: [
    ...(googleConfigured
      ? [GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })]
      : []),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Demo credential login. Upserts a real, stable Prisma User row so every
        // downstream API route can trust session.user.id as a real DB identity
        // instead of falling back to "whichever user happens to be first".
        if (credentials?.email === "admin@agentix.com" && credentials?.password === "admin") {
          const user = await prisma.user.upsert({
            where: { email: "admin@agentix.com" },
            update: {},
            create: {
              id: "default-admin-1",
              name: "Enterprise Admin",
              email: "admin@agentix.com",
              role: "ADMIN",
            },
          });
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
          };
        }
        return null;
      }
    })
  ],
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: { 
    signIn: "/login",
  },
  // No hardcoded fallback: a known secret string committed in source would
  // let anyone forge a valid session JWT against any deployment that forgot
  // to override it. AUTH_SECRET must be set (frontend/.env for local dev -
  // gitignored, generated randomly; a real one in production).
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // @ts-expect-error role is set by the credentials authorize() callback above
        token.role = user.role || "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        // @ts-expect-error Type role is not on NextAuth User
        session.user.role = token.role as string;
      }
      return session;
    }
  }
} satisfies NextAuthConfig;
