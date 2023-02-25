import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import prisma from "./prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import Auth0Provider from "next-auth/providers/auth0";

const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID as string,
      clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
      issuer: process.env.AUTH0_ISSUER as string,
    })
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET as string,
  session: {
    generateSessionToken: () => {
      return Math.random().toString(36).substr(2, 10)
    },
    strategy: "jwt"
  },
}

export default authOptions
