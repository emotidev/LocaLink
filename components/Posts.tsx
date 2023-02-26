'use client'

import { Post } from '@prisma/client'
import fetcher from 'lib/fetcher'
import Link from 'next/link'
import * as React from 'react'
import useSWR from 'swr'

export default function Posts() {
  const posts = useSWR('/api/posts', fetcher)
  const [creatingPost, setCreatingPost] = React.useState(false)

  return (
    <div className="space-y-8 py-4">
      {posts?.error && <div>Failed to load posts.</div>}
      {posts?.isLoading && <div>Loading...</div>}
      {posts?.data && posts.data.length === 0 && <div>No posts yet.</div>}
      {posts?.data && posts.data.length > 0 && (
        <div className="space-y-4">
          {posts.data.map((post: Post) => (
            <div
              key={post.id}
              className="bg-slate-3 dark:bg-slateDark-3 rounded p-4 space-y-4">
              <div className="text-2xl font-bold">{post.title}</div>
              <div className="text-lg">
                {post.content?.substring(0, 200 - 1)}...
              </div>
              <Link href={`/posts/${post.id}`}>
                <button className="bg-slate-3 dark:bg-slateDark-3 rounded p-2">
                  Read More
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
      {!creatingPost && (
        <button
          className="bg-slate-3 dark:bg-slateDark-3 rounded p-2"
          onClick={() => setCreatingPost(true)}>
          Create Post
        </button>
      )}
      {creatingPost && (
        <form
          className="flex flex-col space-y-4"
          onSubmit={(ev) => {
            ev.preventDefault()
            const data = new FormData(ev.target as HTMLFormElement)

            fetch('/api/posts', {
              method: 'POST',
              body: `{"title": "${encodeURIComponent(
                data.get('title') as string
              )}","content": "${encodeURIComponent(
                data.get('content') as string
              )}"}`
            }).then((res) => {
              if (res.ok) {
                setCreatingPost(false)
                alert('Post created!')
              } else {
                alert('Failed to create post.')
              }
            })
          }}>
          <input
            className="bg-slate-3 dark:bg-slateDark-3 rounded p-2"
            name="title"
            id="title"
            placeholder="Title"
          />
          <textarea
            className="bg-slate-3 dark:bg-slateDark-3 rounded p-2"
            name="content"
            id="content"
            placeholder="Content"
          />
          <button className="bg-slate-3 dark:bg-slateDark-3 rounded p-2">
            Create Post
          </button>
        </form>
      )}
    </div>
  )
}
