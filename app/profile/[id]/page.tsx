import * as React from 'react'
import Profile from 'components/Profile'
import { getServerSession } from 'next-auth'

export default async function Page({
  params
}: {
  params: {
    id: string
  }
}) {
  const id = params.id

  const session = await getServerSession()

  return <Profile id={id} session={session} />
}
