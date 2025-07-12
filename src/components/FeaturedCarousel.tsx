"use client"

import { useState, useEffect } from 'react'
import { ItemsCarousel } from './ItemsCarousel'

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

export function FeaturedCarousel() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const response = await fetch('/api/items/featured')
        if (response.ok) {
          const data = await response.json()
          console.log('Carousel items fetched:', data.items)
          setItems(data.items)
        }
      } catch (error) {
        console.error('Error fetching carousel items:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedItems()
  }, [])

  if (loading) {
    return (
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return <ItemsCarousel items={items} />
} 