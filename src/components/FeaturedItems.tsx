"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Item {
  id: string
  title: string
  description: string
  category: string
  size: string
  condition: string
  images: string[]
  owner: {
    name: string
  }
}

export function FeaturedItems() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const response = await fetch('/api/items/featured')
        if (response.ok) {
          const data = await response.json()
          console.log('Featured items fetched:', data.items)
          setItems(data.items)
        }
      } catch (error) {
        console.error('Error fetching featured items:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedItems()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
            <div className="bg-gray-200 h-4 rounded mb-2"></div>
            <div className="bg-gray-200 h-3 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No featured items available yet.</p>
        <p className="text-gray-400 mt-2">Be the first to upload an item!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.slice(0, 6).map((item) => (
        <Link key={item.id} href={`/item/${item.id}`}>
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative h-48 bg-gray-100">
              {item.images && item.images.length > 0 ? (
                <Image
                  src={item.images[0]}
                  alt={item.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    console.error('Image failed to load:', item.images[0]);
                    console.error('Error event:', e);
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully:', item.images[0]);
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 text-gray-900">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {item.description}
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{item.category}</span>
                <span>Size: {item.size}</span>
              </div>
              <div className="mt-2 text-xs text-gray-400">
                by {item.owner.name}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
} 