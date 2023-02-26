import CreateProfile from 'components/CreateProfile'
import prisma from 'lib/prisma'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import * as React from 'react'

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  if (!session) {
    return (
      <div className="w-full min-h-[66.66vh] flex flex-col items-center justify-center space-y-8 p-4 xs:p-8 sm:p-12 md:p-16 lg:p-20 xl:p-24 2xl:p-28">
        <h1>You are not logged in</h1>
        <Link
          href="/api/auth/signin"
          className="bg-indigo-9 hover:bg-blackA-1 hover:border-indigo-9 transition-colors border-2 border-blackA-1 py-1 px-3 rounded-sm">
          Log in
        </Link>
      </div>
    )
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user?.email as string
    },
    include: {
      profile: true
    }
  })

  const profile = user?.profile

  if (!profile) {
    return (
      <div className="w-full min-h-[66.66vh] flex flex-col items-center justify-center space-y-8 p-4 xs:p-8 sm:p-12 md:p-16 lg:p-20 xl:p-24 2xl:p-28">
        <h1>Wanna help out others learn about your culture?</h1>
        <CreateProfile />
      </div>
    )
  }

  return <>{children}</>
}
