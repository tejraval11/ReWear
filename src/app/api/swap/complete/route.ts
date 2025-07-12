import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { swapId } = await request.json()

    if (!swapId) {
      return NextResponse.json(
        { message: 'Swap ID is required' },
        { status: 400 }
      )
    }

    // Get the swap
    const swap = await prisma.swap.findUnique({
      where: { id: swapId },
      include: {
        item: true,
        fromUser: true,
        toUser: true,
      },
    })

    if (!swap) {
      return NextResponse.json(
        { message: 'Swap not found' },
        { status: 404 }
      )
    }

    if (swap.status !== 'PENDING') {
      return NextResponse.json(
        { message: 'Swap is not pending' },
        { status: 400 }
      )
    }

    // Only the item owner or admin can complete the swap
    if (swap.toUserId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized to complete this swap' },
        { status: 401 }
      )
    }

    // Use a transaction to ensure data consistency
    await prisma.$transaction(async (tx) => {
      // Update swap status
      await tx.swap.update({
        where: { id: swapId },
        data: { status: 'COMPLETED' },
      })

      // Update item owner
      await tx.item.update({
        where: { id: swap.itemId },
        data: { ownerId: swap.fromUserId },
      })

      // Deduct points from the user who received the item
      await tx.user.update({
        where: { id: swap.fromUserId },
        data: {
          points: {
            decrement: 10,
          },
        },
      })

      // Add points to the user who gave the item
      await tx.user.update({
        where: { id: swap.toUserId },
        data: {
          points: {
            increment: 10,
          },
        },
      })
    })

    return NextResponse.json({
      message: 'Swap completed successfully',
    })
  } catch (error) {
    console.error('Swap completion error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 