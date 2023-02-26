/* eslint-disable @next/next/no-img-element */
'use client'

import * as React from 'react'
import useSwr from 'swr'
import fetcher from 'lib/fetcher'
import { Chat, Culture, Post, Prisma, Profile, User } from '@prisma/client'
import Link from 'next/link'

export default function Discover() {
  const profiles = useSwr('/api/profile?all=true', fetcher)
  const cultures = useSwr('/api/culture?all=true', fetcher)

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <h3>Locals willing to help you learn about culture</h3>
        <div className="flex gap-8 flex-wrap">
          {profiles.isLoading && <div>Loading...</div>}
          {profiles.data?.map(
            (
              profile: Profile & {
                _count: Prisma.ProfileCountOutputType
                user: User
                culture: Culture
                chats: Chat[]
                posts: Post[]
                followers: User[]
                following: User[]
              }
            ) => (
              <Link key={profile.id} href={`/profile/${profile.id}`}>
                <div className="flex bg-slate-3 dark:bg-slateDark-3 max-w-max p-4 flex-col items-center justify-center space-y-4 rounded-sm">
                  <img
                    src={
                      profile.user.image ??
                      'https://dicebear.com/api/avataaars/seed.svg?m=6&b=%23f5f5f5&c=%23f5f5f5&h=32&w=32&s=32'
                    }
                    className="rounded-full !my-0 h-32 w-32"
                  />
                  <div className="text-2xl font-bold">{profile.user.name}</div>
                  <div className="text-lg">{profile.culture.name}</div>
                </div>
              </Link>
            )
          )}
        </div>
      </div>
      <div className="space-y-4">
        <h3>Supported Cultures</h3>
        <div className="flex gap-4 flex-wrap">
          {cultures.isLoading && <div>Loading...</div>}
          {cultures.data?.map((culture: Culture) => (
            <div
              key={culture.id}
              className="flex bg-slate-3 dark:bg-slateDark-3 max-w-max p-2 flex-col items-center justify-center space-y-4 rounded-sm">
              {culture.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
