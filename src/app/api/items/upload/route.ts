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

    const { title, description, category, size, condition, tags, images } = await request.json()

    // Validate input
    if (!title || !description || !category || !size || !condition) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create item
    const item = await prisma.item.create({
      data: {
        title,
        description,
        category,
        size,
        condition,
        tags: tags || [],
        images: images || [],
        status: 'PENDING',
        ownerId: session.user.id,
      },
      include: {
        owner: {
          select: {
            name: true,
          },
        },
      },
    })

    return NextResponse.json(
      { message: 'Item uploaded successfully', item },
      { status: 201 }
    )
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 