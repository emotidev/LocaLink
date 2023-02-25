/* eslint-disable @next/next/no-img-element */
import 'kresco/styles/tailwind.css'

import * as React from 'react'
import { NavigationMenu, BaseLayout } from 'kresco/esm/src'
import { Poppins } from 'next/font/google'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import Image from 'next/image'

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  subsets: ['latin-ext'],
  variable: '--font-poppins'
})

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  return (
    <BaseLayout className={poppins.variable}>
      <NavigationMenu.Root>
        <NavigationMenu.Item>
          <Link href="/" className="text-lg font-bold">
            LocaLink
          </Link>
        </NavigationMenu.Item>
        <div className="hidden md:flex space-x-4">
          <NavigationMenu.Item>
            <Link href="https://github.com/krshkun/localink">GitHub</Link>
          </NavigationMenu.Item>
          {session ? (
            <NavigationMenu.Item>
              <NavigationMenu.Trigger>
                <div className="flex items-center space-x-2">
                  <img
                    src={
                      session.user?.image ??
                      'https://dicebear.com/api/avataaars/seed.svg?m=6&b=%23f5f5f5&c=%23f5f5f5&h=32&w=32&s=32'
                    }
                    alt={session.user?.name ?? 'User'}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </div>
              </NavigationMenu.Trigger>
              <NavigationMenu.Content direction="bottom-right">
                <ul className="flex flex-col space-y-2">
                  <NavigationMenu.Link href="/api/auth/signout">
                    Sign out
                  </NavigationMenu.Link>
                </ul>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          ) : (
            <NavigationMenu.Item>
              <Link href="/api/auth/signin">Sign in</Link>
            </NavigationMenu.Item>
          )}
        </div>
        <div className="md:hidden">
          <NavigationMenu.Item>
            <NavigationMenu.Trigger>Menu</NavigationMenu.Trigger>
            <NavigationMenu.Content direction="bottom-right">
              <ul className="flex flex-col space-y-2">
                <NavigationMenu.Link href="https://github.com/krshkun/localink">
                  View source code
                </NavigationMenu.Link>
              </ul>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        </div>
      </NavigationMenu.Root>
      {children}
    </BaseLayout>
  )
}
