import prisma from 'lib/prisma'
import { getServerSession } from 'next-auth/next'

export async function GET(req: Request) {
  const url = new URL(req.url)

  const id = url.searchParams.get('id')
  const mine = new Boolean(url.searchParams.get('mine'))

  const session = await getServerSession()

  if (!session) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), {
      status: 401
    })
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user?.email as string
    }
  })

  if (mine) {
    try {
      await prisma.chat.findMany({
        where: {
          OR: [
            {
              fromId: user?.id as string
            },
            {
              toId: user?.id as string
            }
          ]
        }
      })

      return new Response(JSON.stringify({ error: 'Chat not found' }), {
        status: 404
      })
    } catch (err) {
      return new Response(JSON.stringify(err), {
        status: 500
      })
    }
  }

  if (id !== null) {
    try {
      await prisma.chat.findUnique({
        where: {
          id
        }
      })

      return new Response(JSON.stringify({ error: 'Chat not found' }), {
        status: 404
      })
    } catch (err) {
      return new Response(JSON.stringify(err), {
        status: 500
      })
    }
  }

  return new Response(JSON.stringify({ error: 'Invalid data' }), {
    status: 400
  })
}
