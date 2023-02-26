import prisma from 'lib/prisma'
import { getServerSession } from 'next-auth'

export async function GET(req: Request) {
  const url = new URL(req.url)

  const id = url.searchParams.get('id')
  const authorId = url.searchParams.get('authorId')

  if (typeof id !== 'string') {
    try {
      const posts = await prisma.post.findMany()

      return new Response(JSON.stringify(posts), {
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

  if (typeof authorId === 'string') {
    try {
      const posts = await prisma.post.findMany({
        where: {
          authorId: authorId
        }
      })

      return new Response(JSON.stringify(posts), {
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

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: id
      }
    })

    return new Response(JSON.stringify(post), {
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

  const { title, content } = JSON.parse(await req.text())

  if (typeof title !== 'string' || typeof content !== 'string') {
    return new Response(JSON.stringify({ error: 'Invalid data' }), {
      status: 400
    })
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user?.email as string
    }
  })

  const author = await prisma.profile.findUnique({
    where: {
      userId: user?.id as string
    }
  })

  if (!author) {
    return new Response(
      JSON.stringify({ error: 'You must be a local to post' }),
      {
        status: 404
      }
    )
  }

  if (!author.cultureId) {
    return new Response(
      JSON.stringify({ error: 'You have not yet set a culture' }),
      {
        status: 404
      }
    )
  }

  try {
    const post = await prisma.post.create({
      data: {
        title: decodeURIComponent(title),
        content: decodeURIComponent(content),
        author: {
          connect: {
            id: author.id
          }
        },
        culture: {
          connect: {
            id: author.cultureId
          }
        }
      }
    })

    return new Response(JSON.stringify(post), {
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

export async function PUT(req: Request) {
  const session = await getServerSession()

  if (!session) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), {
      status: 401
    })
  }

  const { id, title, content } = await req.json()

  if (
    typeof id !== 'string' ||
    typeof title !== 'string' ||
    typeof content !== 'string'
  ) {
    return new Response(JSON.stringify({ error: 'Invalid data' }), {
      status: 400
    })
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user?.email as string
    }
  })

  const author = await prisma.profile.findUnique({
    where: {
      userId: user?.id as string
    }
  })

  if (!author) {
    return new Response(
      JSON.stringify({ error: 'You must be a local to post' }),
      {
        status: 404
      }
    )
  }

  if (!author.cultureId) {
    return new Response(
      JSON.stringify({ error: 'You have not yet set a culture' }),
      {
        status: 404
      }
    )
  }

  try {
    const post = await prisma.post.update({
      where: {
        id
      },
      data: {
        title,
        content
      }
    })

    return new Response(JSON.stringify(post), {
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

export async function DELETE(req: Request) {
  const session = await getServerSession()

  if (!session) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), {
      status: 401
    })
  }

  const url = new URL(req.url)

  const id = url.searchParams.get('id')

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

  const author = await prisma.profile.findUnique({
    where: {
      userId: user?.id as string
    }
  })

  try {
    const post = await prisma.post.findUnique({
      where: {
        id
      }
    })

    if (!post) {
      return new Response(JSON.stringify({ error: 'Post not found' }), {
        status: 400
      })
    }

    if (post.authorId !== author?.id) {
      return new Response(JSON.stringify({ error: 'Not authorized' }), {
        status: 401
      })
    }

    const message = await prisma.post.delete({
      where: {
        id
      }
    })

    return new Response(JSON.stringify(message), {
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
