import prisma from 'lib/prisma'

export async function GET() {
  const include = {
    _count: true,
    user: true,
    culture: true,
    chats: true,
    posts: true,
    followers: true,
    following: true
  }

  try {
    const profiles = await prisma.profile.findMany({
      include
    })

    return new Response(JSON.stringify(profiles))
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify(err), {
      status: 500
    })
  }
}
