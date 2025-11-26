import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: Record<'email' | 'password', string> | undefined) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findFirst({
          where: { email: credentials.email },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id.toString(),
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const newToken = { ...token } as any;
      if (user) {
        newToken.role = (user as any).role ?? newToken.role;
      }
      if (!newToken.role && newToken.email) {
        const dbUser = await prisma.user.findFirst({ where: { email: newToken.email as string } });
        if (dbUser) newToken.role = dbUser.role;
      }
      return newToken;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...(session.user ?? {}),
          role: (token as any).role,
        },
      };
    },
  },
};

export default NextAuth(authOptions);
