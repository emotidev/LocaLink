/* eslint-disable @next/next/no-img-element */
'use client'

import * as React from 'react'
import useSwr from 'swr'
import fetcher from 'lib/fetcher'
import {
  Chat,
  Culture,
  Post,
  Prisma,
  Profile as DbProfile,
  User
} from '@prisma/client'
import { Session } from 'next-auth'

export default function Profile({
  id,
  session
}: {
  id: string
  session: Session | null
}) {
  const profile: {
    data?: DbProfile & {
      _count: Prisma.ProfileCountOutputType
      user: User
      culture: Culture
      chats: Chat[]
      posts: Post[]
      followers: User[]
      following: User[]
    }
    error?: Error
    isLoading: boolean
  } = useSwr(`/api/profile?id=${id}`, fetcher)

  const profileData = profile.data

  console.log(profileData)

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-8 p-4 xs:p-8 sm:p-12 md:p-16 lg:p-20 xl:p-24 2xl:p-28">
      {profile.isLoading && <div>Loading...</div>}
      {profileData && (
        <div className="w-full">
          <div className="flex w-full flex-col items-center space-y-4 bg-slate-3 dark:bg-slateDark-3 py-4 rounded">
            <img
              src={
                profileData.user.image ??
                'https://dicebear.com/api/avataaars/seed.svg?m=6&b=%23f5f5f5&c=%23f5f5f5&h=32&w=32&s=32'
              }
              className="rounded-full !my-0 h-32 w-32"
            />
            <h2>{profileData.user.name}</h2>
            <div className="text-lg">{profileData.culture.name} Culture</div>
            <div>
              {profileData._count.chats} chats, {profileData._count.followers}{' '}
              followers, {profileData._count.following} following
            </div>
            {session && session.user?.email !== profileData.user.email && (
              <div className="flex gap-4">
                <button
                  className="bg-slate-2 dark:bg-slateDark-2 rounded-sm py-1 px-3"
                  onClick={() => {
                    const unfollow = profileData.followers.find(
                      (follower) => follower.email === session.user?.email
                    )

                    fetch('/api/profile/follow', {
                      method: unfollow ? 'DELETE' : 'POST',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                        id: profileData.id
                      })
                    }).then((res) => {
                      if (res.ok) {
                        alert(unfollow ? 'Unfollowed!' : 'Followed!')
                      }
                    })
                  }}>
                  {profileData.followers.find(
                    (follower) => follower.email === session.user?.email
                  )
                    ? 'Unfollow'
                    : 'Follow'}
                </button>
                <button className="bg-slate-2 dark:bg-slateDark-2 rounded-sm py-1 px-3">
                  Message
                </button>
              </div>
            )}
          </div>
          <div className="flex w-full flex-col items-center space-y-4 py-4 rounded">
            <div className="text-2xl font-bold">Posts</div>
            <div className="flex flex-col items-center space-y-4">
              {profileData.posts.length === 0 && (
                <div className="text-lg">No posts yet</div>
              )}
              {profileData.posts.map((post) => (
                <div
                  className="flex flex-col items-center space-y-4"
                  key={post.id}>
                  <div className="text-lg">{post.title}</div>
                  <div className="text-lg">
                    {Intl.DateTimeFormat('en-us').format(post.createdAt)}
                  </div>
                  <div className="text-lg">
                    {post.content?.substring(0, 50 - 1)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
