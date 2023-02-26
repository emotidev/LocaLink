'use client'

import fetcher from 'lib/fetcher'
import * as React from 'react'
import useSwr from 'swr'

export default function Chats() {
  const chats = useSwr('/api/chat', fetcher)

  return (
    <div className="space-y-8 py-4">
      {chats?.error && <div>Failed to load chats.</div>}
      {chats?.isLoading && <div>Loading...</div>}
      {chats?.data && chats.data.length === 0 && <div>No chats yet.</div>}
    </div>
  )
}
