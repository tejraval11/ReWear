import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // PENDING, COMPLETED, CANCELLED, or null for all
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const whereClause: any = {}
    
    if (status && status !== 'ALL') {
      whereClause.status = status
    }
    
    if (search) {
      whereClause.OR = [
        { item: { title: { contains: search, mode: 'insensitive' } } },
        { fromUser: { name: { contains: search, mode: 'insensitive' } } },
        { fromUser: { email: { contains: search, mode: 'insensitive' } } },
        { toUser: { name: { contains: search, mode: 'insensitive' } } },
        { toUser: { email: { contains: search, mode: 'insensitive' } } },
      ]
    }

    const [swaps, totalCount] = await Promise.all([
      prisma.swap.findMany({
        where: whereClause,
        select: {
          id: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          item: {
            select: {
              id: true,
              title: true,
              images: true,
              category: true,
              size: true,
              condition: true,
            },
          },
          fromUser: {
            select: {
              id: true,
              name: true,
              email: true,
              points: true,
            },
          },
          toUser: {
            select: {
              id: true,
              name: true,
              email: true,
              points: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.swap.count({ where: whereClause })
    ])

    return NextResponse.json({ 
      swaps, 
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      hasMore: page * limit < totalCount
    })
  } catch (error) {
    console.error('Error fetching swaps:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { swapId, action } = await request.json()

    if (!swapId || !action) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!['APPROVE', 'REJECT', 'CANCEL'].includes(action)) {
      return NextResponse.json(
        { message: 'Invalid action' },
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

    // Use a transaction to ensure data consistency
    await prisma.$transaction(async (tx) => {
      if (action === 'APPROVE') {
        // Update swap status to completed
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
      } else if (action === 'REJECT' || action === 'CANCEL') {
        // Update swap status to cancelled
        await tx.swap.update({
          where: { id: swapId },
          data: { status: 'CANCELLED' },
        })
      }
    })

    return NextResponse.json({
      message: `Swap ${action.toLowerCase()}d successfully`,
    })
  } catch (error) {
    console.error('Error managing swap:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 