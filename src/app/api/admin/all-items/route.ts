import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

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
    const status = searchParams.get('status') // PENDING, APPROVED, REJECTED, or null for all
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const whereClause: {
      status?: 'PENDING' | 'APPROVED' | 'REJECTED';
      OR?: Array<{
        title?: { contains: string; mode: 'insensitive' };
        description?: { contains: string; mode: 'insensitive' };
        owner?: { 
          name?: { contains: string; mode: 'insensitive' };
          email?: { contains: string; mode: 'insensitive' };
        };
      }>;
    } = {}
    
    if (status && status !== 'ALL') {
      whereClause.status = status as 'PENDING' | 'APPROVED' | 'REJECTED'
    }
    
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { owner: { name: { contains: search, mode: 'insensitive' } } },
        { owner: { email: { contains: search, mode: 'insensitive' } } },
      ]
    }

    const [items, totalCount] = await Promise.all([
      prisma.item.findMany({
        where: whereClause,
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          size: true,
          condition: true,
          tags: true,
          images: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          owner: {
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
      prisma.item.count({ where: whereClause })
    ])

    return NextResponse.json({ 
      items, 
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      hasMore: page * limit < totalCount
    })
  } catch (error) {
    console.error('Error fetching all items:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 