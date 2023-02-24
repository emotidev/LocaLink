import 'kresco/styles/tailwind.css'

import * as React from 'react'
import { NavigationMenu, BaseLayout } from 'kresco/esm/src'
import { Poppins } from 'next/font/google'
import Link from 'next/link'

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  subsets: ['latin-ext'],
  variable: '--font-poppins'
})

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
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
        </div>
        <div className="md:hidden">
          <NavigationMenu.Item>
            <NavigationMenu.Trigger>Menu</NavigationMenu.Trigger>
            <NavigationMenu.Content direction="bottom-right">
              <ul className="flex flex-col space-y-2">
                <NavigationMenu.Link href="https://github.com/krshkun/accsensible">
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
