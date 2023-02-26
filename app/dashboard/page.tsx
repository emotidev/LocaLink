import * as React from 'react'

export default function Page() {
  return (
    <div className="space-y-8 p-4 xs:p-8 sm:p-12 md:p-16 lg:p-20 xl:p-24 2xl:p-28">
      <h1>Dashboard</h1>
      <div className="grid grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1">
        <div>
          <h2>Chats</h2>
        </div>
        <div>
          <h2>Posts</h2>
        </div>
      </div>
    </div>
  )
}
