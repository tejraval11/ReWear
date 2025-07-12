import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Get query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const condition = searchParams.get('condition') || ''
    const sortBy = searchParams.get('sortBy') || 'newest'
    
    const skip = (page - 1) * limit

    // Build where clause
    const where: Prisma.ItemWhereInput = {
      // Temporarily show all items for testing
      // status: 'APPROVED' // Only show approved items
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (category && category !== 'All') {
      where.category = category
    }

    if (condition && condition !== 'All') {
      where.condition = condition
    }

    // Build order by clause
    const orderBy: Prisma.ItemOrderByWithRelationInput = {}
    
    switch (sortBy) {
      case 'newest':
        orderBy.createdAt = 'desc'
        break
      case 'oldest':
        orderBy.createdAt = 'asc'
        break
      case 'title':
        orderBy.title = 'asc'
        break
      default:
        orderBy.createdAt = 'desc'
    }

    // Get total count for pagination
    const totalItems = await prisma.item.count({ where })
    const totalPages = Math.ceil(totalItems / limit)

    // Get items with owner information
    const items = await prisma.item.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        owner: {
          select: {
            name: true
          }
        }
      }
    })

    return NextResponse.json({
      items,
      totalItems,
      totalPages,
      currentPage: page,
      itemsPerPage: limit
    })

  } catch (error) {
    console.error('Error fetching items for browse:', error)
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    )
  }
} 