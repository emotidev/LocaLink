import prisma from 'lib/prisma'
import Link from 'next/link'
import * as React from 'react'

export default async function Page({
  params
}: {
  params: {
    id: string
  }
}) {
  const id = params.id

  const post = await prisma.post.findUnique({
    where: {
      id: id
    },
    include: {
      author: {
        include: {
          user: true,
          posts: true,
          followers: true,
          following: true,
          chats: true,
          culture: true,
          _count: true
        }
      }
    }
  })

  if (!post) {
    return <div>Post not found.</div>
  }

  return (
    <div className="space-y-8 p-4 xs:p-8 sm:p-12 md:p-16 lg:p-20 xl:p-24 2xl:p-28">
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p>
        By{' '}
        <Link href={`/profile/${post.authorId}`}>{post.author.user.name}</Link>
      </p>
    </div>
  )
}
