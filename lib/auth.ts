import { NextAuthOptions } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0"
import prisma from "./prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

const authOptions: NextAuthOptions = {
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID as string,
      clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
      issuer: process.env.AUTH0_DOMAIN
    })
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'database',
    maxAge: 90 * 24 * 60 * 60,
  }
}

export default authOptions
