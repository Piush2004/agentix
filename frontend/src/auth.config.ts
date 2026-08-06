import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // For testing/audit purposes:
        if (credentials?.email === "admin@agentix.com" && credentials?.password === "admin") {
          return {
            id: "default-admin-1",
            name: "Enterprise Admin",
            email: "admin@agentix.com",
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
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "super-secret-audit-key",
  trustHost: true,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = "ADMIN";
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
