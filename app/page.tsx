import Link from 'next/link'
import * as React from 'react'

export default function Page() {
  return (
    <div className="w-full h-[66.66vh] flex flex-col items-center justify-center space-y-8 p-4 xs:p-8 sm:p-12 md:p-16 lg:p-20 xl:p-24 2xl:p-28">
      <h1>Connecting Cultures</h1>
      <p className="max-w-prose text-center">
        Let{"'"}s be honest, the best knowledge about a culture is from the
        people of the culture, not from a book or a movie. We{"'"}re here to
        help you connect with locals from all over the world.
      </p>
      <Link
        href="/discover"
        className="bg-indigo-9 hover:bg-blackA-1 hover:border-indigo-9 transition-colors border-2 border-blackA-1 py-1 px-3 rounded-sm">
        Explore cultures
      </Link>
    </div>
  )
}
