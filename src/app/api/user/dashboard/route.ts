import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        points: true,
        role: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    // Get user's items
    const items = await prisma.item.findMany({
      where: { ownerId: session.user.id },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        images: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    // Get user's swaps
    const swaps = await prisma.swap.findMany({
      where: {
        OR: [
          { fromUserId: session.user.id },
          { toUserId: session.user.id },
        ],
      },
      include: {
        item: {
          select: {
            title: true,
            images: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      user,
      items,
      swaps,
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 