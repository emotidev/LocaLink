import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import prisma from "./prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    })
  ],
  adapter: PrismaAdapter(prisma),
}

export default authOptions
