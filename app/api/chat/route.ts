import prisma from 'lib/prisma'
import { getServerSession } from 'next-auth/next'

export async function GET(req: Request) {
  const url = new URL(req.url)

  const id = url.searchParams.get('id')

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

  if (id === null) {
    try {
      const chat = await prisma.chat.findMany({
        where: {
          OR: [
            {
              fromId: user?.id as string
            },
            {
              toId: user?.id as string
            }
          ]
        },
        include: {
          messages: true
        }
      })

      return new Response(JSON.stringify(chat), {
        status: 200
      })
    } catch (err) {
      return new Response(JSON.stringify(err), {
        status: 500
      })
    }
  }

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

  const user = await prisma.user.findUnique({
    where: {
      email: session.user?.email as string
    }
  })

  try {
    const createdChat = await prisma.chat.create({
      data: {
        fromId: user?.id as string,
        toId: id
      }
    })

    return new Response(JSON.stringify(createdChat), {
      status: 200
    })
  } catch (err) {
    return new Response(JSON.stringify(err), {
      status: 500
    })
  }
}
