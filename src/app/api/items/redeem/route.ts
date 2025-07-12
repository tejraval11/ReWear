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
        { message: 'Item is not available for redemption' },
        { status: 400 }
      )
    }

    if (item.ownerId === session.user.id) {
      return NextResponse.json(
        { message: 'You cannot redeem your own item' },
        { status: 400 }
      )
    }

    // Get user's current points
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { points: true },
    })

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    const requiredPoints = 10
    if (user.points < requiredPoints) {
      return NextResponse.json(
        { message: `Insufficient points. You need ${requiredPoints} points to redeem this item.` },
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
        { message: 'This item is already being processed' },
        { status: 400 }
      )
    }

    // Use a transaction to ensure data consistency
    await prisma.$transaction(async (tx) => {
      // Create swap record for redemption
      await tx.swap.create({
        data: {
          fromUserId: session.user.id,
          toUserId: item.ownerId,
          itemId,
          status: 'COMPLETED', // Direct redemption
        },
      })

      // Update item owner
      await tx.item.update({
        where: { id: itemId },
        data: { ownerId: session.user.id },
      })

      // Deduct points from the user who redeemed the item
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          points: {
            decrement: requiredPoints,
          },
        },
      })

      // Add points to the user who gave the item
      await tx.user.update({
        where: { id: item.ownerId },
        data: {
          points: {
            increment: requiredPoints,
          },
        },
      })
    })

    return NextResponse.json({
      message: 'Item redeemed successfully',
    })
  } catch (error) {
    console.error('Item redemption error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 