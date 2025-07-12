import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const items = await prisma.item.findMany({
      where: {
        // Temporarily show all items for testing
        // status: 'APPROVED',
      },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        size: true,
        condition: true,
        images: true,
        status: true,
        owner: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 6,
    })

    return NextResponse.json({ items })
  } catch (error) {
    console.error('Error fetching featured items:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 