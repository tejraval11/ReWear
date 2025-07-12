import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get all statistics in parallel
    const [
      totalUsers,
      totalItems,
      pendingItems,
      approvedItems,
      rejectedItems,
      totalSwaps,
      pendingSwaps
    ] = await Promise.all([
      prisma.user.count(),
      prisma.item.count(),
      prisma.item.count({ where: { status: 'PENDING' } }),
      prisma.item.count({ where: { status: 'APPROVED' } }),
      prisma.item.count({ where: { status: 'REJECTED' } }),
      prisma.swap.count(),
      prisma.swap.count({ where: { status: 'PENDING' } })
    ])

    return NextResponse.json({
      totalUsers,
      totalItems,
      pendingItems,
      approvedItems,
      rejectedItems,
      totalSwaps,
      pendingSwaps
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 