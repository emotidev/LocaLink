import prisma from 'lib/prisma'

export async function GET(req: Request) {
  const url = new URL(req.url)

  const id = url.searchParams.get('id')

  if (typeof id !== 'string') {
    try {
      const cultures = await prisma.culture.findMany()

      return new Response(JSON.stringify(cultures), {
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
    const culture = await prisma.culture.findUnique({
      where: {
        id: id
      }
    })

    return new Response(JSON.stringify(culture), {
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
  const { name } = await req.json()

  try {
    const culture = await prisma.culture.create({
      data: {
        name
      }
    })

    return new Response(JSON.stringify(culture), {
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
