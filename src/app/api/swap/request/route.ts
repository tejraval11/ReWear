import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { itemId } = await request.json()

    if (!itemId) {
      return NextResponse.json(
        { message: 'Item ID is required' },
        { status: 400 }
      )
    }

    // Get the item
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: { owner: true },
    })

    if (!item) {
      return NextResponse.json(
        { message: 'Item not found' },
        { status: 404 }
      )
    }

    if (item.status !== 'APPROVED') {
      return NextResponse.json(
        { message: 'Item is not available for swapping' },
        { status: 400 }
      )
    }

    if (item.ownerId === session.user.id) {
      return NextResponse.json(
        { message: 'You cannot swap your own item' },
        { status: 400 }
      )
    }

    // Check if there's already a pending swap for this item
    const existingSwap = await prisma.swap.findFirst({
      where: {
        itemId,
        status: 'PENDING',
      },
    })

    if (existingSwap) {
      return NextResponse.json(
        { message: 'This item is already being swapped' },
        { status: 400 }
      )
    }

    // Create swap request
    const swap = await prisma.swap.create({
      data: {
        fromUserId: session.user.id,
        toUserId: item.ownerId,
        itemId,
        status: 'PENDING',
      },
      include: {
        item: {
          select: {
            title: true,
          },
        },
        fromUser: {
          select: {
            name: true,
          },
        },
        toUser: {
          select: {
            name: true,
          },
        },
      },
    })

    return NextResponse.json({
      message: 'Swap request created successfully',
      swap,
    })
  } catch (error) {
    console.error('Swap request error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 