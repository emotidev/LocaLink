import prisma from 'lib/prisma'
import { getServerSession } from 'next-auth'

export async function POST(req: Request) {
  const session = await getServerSession()

  if (!session) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), {
      status: 401
    })
  }

  const { id } = await req.json()

  if (typeof id !== 'string') {
    return new Response(JSON.stringify({ error: 'Invalid data' }), {
      status: 400
    })
  }

  try {
    const updatedUser = await prisma.profile.update({
      where: {
        id
      },
      data: {
        following: {
          connect: {
            email: session.user?.email as string
          }
        }
      }
    })

    return new Response(JSON.stringify(updatedUser), {
      status: 200
    })
  } catch (err) {
    return new Response(JSON.stringify(err), {
      status: 500
    })
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession()

  if (!session) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), {
      status: 401
    })
  }

  const { id } = await req.json()

  if (typeof id !== 'string') {
    return new Response(JSON.stringify({ error: 'Invalid data' }), {
      status: 400
    })
  }

  try {
    const updatedUser = await prisma.profile.update({
      where: {
        id
      },
      data: {
        following: {
          disconnect: {
            email: session.user?.email as string
          }
        }
      }
    })

    return new Response(JSON.stringify(updatedUser), {
      status: 200
    })
  } catch (err) {
    return new Response(JSON.stringify(err), {
      status: 500
    })
  }
}
