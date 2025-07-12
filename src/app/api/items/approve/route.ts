import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { itemId, action } = await request.json()

    if (!itemId || !action) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!['APPROVE', 'REJECT', 'DELETE'].includes(action)) {
      return NextResponse.json(
        { message: 'Invalid action' },
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

    if (action === 'DELETE') {
      await prisma.item.delete({
        where: { id: itemId },
      })
      return NextResponse.json({ message: 'Item deleted successfully' })
    }

    // Update item status
    const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED'
    
    await prisma.item.update({
      where: { id: itemId },
      data: { status: newStatus },
    })

    // If approved, award points to the owner
    if (action === 'APPROVE') {
      await prisma.user.update({
        where: { id: item.ownerId },
        data: {
          points: {
            increment: 10,
          },
        },
      })
    }

    return NextResponse.json({
      message: `Item ${action.toLowerCase()}d successfully`,
    })
  } catch (error) {
    console.error('Approval error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 