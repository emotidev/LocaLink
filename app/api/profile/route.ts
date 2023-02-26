import prisma from 'lib/prisma'
import { getServerSession } from 'next-auth'

export async function GET(req: Request) {
  const session = await getServerSession()

  const url = new URL(req.url)

  const include = {
    _count: true,
    user: true,
    culture: true,
    chats: true,
    posts: true,
    followers: true,
    following: true
  }

  const me = new Boolean(url.searchParams.get('me'))
  const all = new Boolean(url.searchParams.get('all'))
  const id = url.searchParams.get('id')

  if (!me && !all && id !== null) {
    return new Response(JSON.stringify({ error: 'Invalid data' }), {
      status: 400
    })
  }

  if (me && !session) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), {
      status: 401
    })
  }

  try {
    if (all) {
      const profiles = await prisma.profile.findMany({
        include
      })

      return new Response(JSON.stringify(profiles), {
        headers: {
          'content-type': 'application/json'
        }
      })
    }

    const user = await prisma.user.findUnique({
      where: me
        ? { email: session?.user?.email as string }
        : { id: id as string }
    })

    const profile = await prisma.profile.findUnique({
      where: {
        userId: user?.id as string
      },
      include: {
        _count: true,
        user: true,
        culture: {
          select: {
            name: true
          }
        },
        chats: true,
        followers: true,
        following: true
      }
    })

    if (!user || !profile) {
      return new Response(JSON.stringify({ error: 'User/Profile not found' }), {
        status: 404
      })
    }

    return new Response(JSON.stringify(profile), {
      headers: {
        'content-type': 'application/json'
      }
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

  const { phone, cultureId, cultureName } = await req.json()

  if (typeof phone !== 'string') {
    return new Response(JSON.stringify({ error: 'Invalid data' }), {
      status: 400
    })
  }

  if (typeof cultureId !== 'string' && typeof cultureName !== 'string') {
    return new Response(
      JSON.stringify({
        error: 'You must provide one of cultureId and cultureName'
      }),
      {
        status: 400
      }
    )
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email as string
      }
    })

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404
      })
    }

    const culture = cultureId
      ? await prisma.culture.findUnique({
          where: {
            id: cultureId
          }
        })
      : await prisma.culture.create({
          data: {
            name: cultureName
          }
        })

    if (!culture) {
      return new Response(JSON.stringify({ error: 'Culture not found' }), {
        status: 404
      })
    }

    const profile = await prisma.profile.create({
      data: {
        phone: phone,
        cultureId: culture.id,
        userId: user.id
      }
    })

    return new Response(JSON.stringify(profile), {
      headers: {
        'content-type': 'application/json'
      }
    })
  } catch (err) {
    return new Response(JSON.stringify(err), {
      status: 500
    })
  }
}
