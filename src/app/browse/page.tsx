"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/Header'
import { Button } from '@/components/ui/Button'
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Package,
  Calendar
} from 'lucide-react'

interface Item {
  id: string
  title: string
  description: string
  category: string
  condition: string
  status: string
  createdAt: string
  images?: string[]
  owner: {
    name: string
  }
}

interface BrowseFilters {
  search: string
  category: string
  condition: string
  sortBy: string
}

const categories = [
  'All',
  'Clothing',
  'Shoes',
  'Accessories',
  'Electronics',
  'Books',
  'Home & Garden',
  'Sports',
  'Toys',
  'Other'
]

const conditions = [
  'All',
  'New',
  'Like New',
  'Good',
  'Fair',
  'Poor'
]

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'title', label: 'Title A-Z' }
]

export default function BrowsePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState<BrowseFilters>({
    search: '',
    category: 'All',
    condition: 'All',
    sortBy: 'newest'
  })

  useEffect(() => {
    fetchItems()
  }, [filters, currentPage])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        ...filters
      })
      
      const response = await fetch(`/api/items/browse?${params}`)
      if (response.ok) {
        const data = await response.json()
        setItems(data.items)
        setTotalPages(data.totalPages)
      }
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: keyof BrowseFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      condition: 'All',
      sortBy: 'newest'
    })
    setCurrentPage(1)
  }

  const handleItemClick = (itemId: string) => {
    router.push(`/item/${itemId}`)
  }

  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container-responsive py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
              <p className="mt-4 text-text-secondary font-body">Loading items...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container-responsive py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-text-primary mb-2">
            Browse Items
          </h1>
          <p className="text-text-secondary font-body">
            Discover pre-loved treasures from our community. Find your next favorite item!
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-soft border border-accent-200 p-6 mb-8">
          {/* Search Bar */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                type="text"
                placeholder="Search items..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-accent-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 font-body"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            <div className="flex border border-accent-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 transition-colors duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-white text-text-secondary hover:bg-accent-50'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 transition-colors duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-white text-text-secondary hover:bg-accent-50'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="border-t border-accent-200 pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-accent-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 font-body"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Condition Filter */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Condition</label>
                  <select
                    value={filters.condition}
                    onChange={(e) => handleFilterChange('condition', e.target.value)}
                    className="w-full px-3 py-2 border border-accent-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 font-body"
                  >
                    {conditions.map(condition => (
                      <option key={condition} value={condition}>{condition}</option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-text-primary">Sort by:</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full px-3 py-2 border border-accent-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 font-body"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              <Button variant="outline" onClick={clearFilters} size="sm">
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-semibold text-text-primary">
              {items.length} items found
            </h2>
            {session?.user && (
              <Link href="/create-listing">
                <Button variant="primary" className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  List Your Item
                </Button>
              </Link>
            )}
          </div>

          {/* Items Grid/List */}
          {items.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-soft border border-accent-200 p-12 text-center">
              <Package className="w-16 h-16 text-accent-300 mx-auto mb-4" />
              <h3 className="text-lg font-heading font-semibold text-text-primary mb-2">No items found</h3>
              <p className="text-text-secondary font-body mb-6">
                Try adjusting your filters or search terms to find what you&apos;re looking for.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </div>
          ) : (
            <>
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
              }>
                {items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`bg-white rounded-2xl shadow-soft border border-accent-200 overflow-hidden hover:shadow-medium transition-all duration-200 cursor-pointer group ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    {/* Image */}
                    <div className={`bg-accent-50 relative overflow-hidden ${
                      viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : 'aspect-square'
                    }`}>
                      {item.images && item.images.length > 0 ? (
                        <Image
                          src={item.images[0]}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-12 h-12 text-accent-300" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-text-primary line-clamp-2 group-hover:text-primary-600 transition-colors">
                          {item.title}
                        </h3>
                      </div>
                      
                      {viewMode === 'list' && (
                        <p className="text-text-secondary text-sm line-clamp-2 mb-3">
                          {item.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs text-text-secondary">
                        <div className="flex items-center gap-4">
                          <span className="capitalize">{item.category}</span>
                          <span className="capitalize">{item.condition}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {viewMode === 'list' && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-accent-100">
                          <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-medium">
                              {item.owner.name?.[0]?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <span className="text-sm text-text-secondary">{item.owner.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors duration-200 ${
                          currentPage === page
                            ? 'bg-primary-500 text-white'
                            : 'bg-white text-text-secondary hover:bg-accent-50 border border-accent-200'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
} 