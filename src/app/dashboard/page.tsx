"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { 
  Package, 
  ShoppingBag, 
  Coins, 
  TrendingUp, 
  Plus,
  Eye,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface DashboardData {
  user: {
    id: string
    name: string
    email: string
    points: number
    role: string
    avatarUrl?: string
  }
  items: Array<{
    id: string
    title: string
    status: string
    createdAt: string
    images?: string[]
  }>
  swaps: Array<{
    id: string
    item: {
      title: string
      images?: string[]
    }
    status: string
    createdAt: string
  }>
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
      return
    }
    fetchDashboardData()
  }, [session, status, router])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/user/dashboard')
      if (response.ok) {
        const data = await response.json()
        setDashboardData(data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="w-4 h-4 text-warning-500" />
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-success-500" />
      case 'rejected':
        return <XCircle className="w-4 h-4 text-alert-500" />
      default:
        return <Clock className="w-4 h-4 text-text-secondary" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-warning-600 bg-warning-50 border-warning-200'
      case 'approved':
        return 'text-success-600 bg-success-50 border-success-200'
      case 'rejected':
        return 'text-alert-600 bg-alert-50 border-alert-200'
      default:
        return 'text-text-secondary bg-accent-50 border-accent-200'
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-text-secondary font-body">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session || !session.user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container-responsive py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-text-primary mb-2">
            Welcome back, {dashboardData?.user.name?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="text-text-secondary font-body">
            Manage your listings, track your swaps, and monitor your points balance.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-soft border border-accent-200 p-6 hover:shadow-medium transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <Coins className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-text-primary">
                {dashboardData?.user.points || 0}
              </span>
            </div>
            <h3 className="text-text-secondary font-body text-sm mb-1">Available Points</h3>
            <p className="text-text-primary font-medium">Ready to spend</p>
          </div>

          <div className="bg-white rounded-2xl shadow-soft border border-accent-200 p-6 hover:shadow-medium transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-text-primary">
                {dashboardData?.items.length || 0}
              </span>
            </div>
            <h3 className="text-text-secondary font-body text-sm mb-1">Active Listings</h3>
            <p className="text-text-primary font-medium">Your items</p>
          </div>

          <div className="bg-white rounded-2xl shadow-soft border border-accent-200 p-6 hover:shadow-medium transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cta-500 to-cta-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-text-primary">
                {dashboardData?.swaps.filter(s => s.status === 'PENDING').length || 0}
              </span>
            </div>
            <h3 className="text-text-secondary font-body text-sm mb-1">Pending Swaps</h3>
            <p className="text-text-primary font-medium">Awaiting approval</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-soft border border-accent-200 p-6 mb-8">
          <h2 className="text-xl font-heading font-semibold text-text-primary mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/create-listing">
              <Button variant="primary" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create New Listing
              </Button>
            </Link>
            <Link href="/browse">
              <Button variant="outline" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Browse Items
              </Button>
            </Link>
          </div>
        </div>

        {/* My Listings */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-heading font-semibold text-text-primary">My Listings</h2>
            <Link href="/create-listing">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add New
              </Button>
            </Link>
          </div>
          
          {dashboardData?.items.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-soft border border-accent-200 p-12 text-center">
              <Package className="w-16 h-16 text-accent-300 mx-auto mb-4" />
              <h3 className="text-lg font-heading font-semibold text-text-primary mb-2">No listings yet</h3>
              <p className="text-text-secondary font-body mb-6">Start sharing your pre-loved items with the community!</p>
              <Link href="/create-listing">
                <Button variant="primary" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Your First Listing
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {dashboardData?.items.map((item) => (
                <Link key={item.id} href={`/item/${item.id}`} className="group">
                  <div className="bg-white rounded-2xl shadow-soft border border-accent-200 overflow-hidden hover:shadow-medium transition-all duration-200 group-hover:scale-[1.02]">
                    <div className="aspect-square bg-accent-50 relative overflow-hidden">
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
                    <div className="p-4">
                      <h3 className="font-medium text-text-primary mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {item.title}
                      </h3>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        {item.status.toLowerCase()}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* My Swaps */}
        <div className="mb-8">
          <h2 className="text-2xl font-heading font-semibold text-text-primary mb-6">My Swaps</h2>
          
          {dashboardData?.swaps.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-soft border border-accent-200 p-12 text-center">
              <ShoppingBag className="w-16 h-16 text-accent-300 mx-auto mb-4" />
              <h3 className="text-lg font-heading font-semibold text-text-primary mb-2">No swaps yet</h3>
              <p className="text-text-secondary font-body mb-6">Start exploring items and make your first swap!</p>
              <Link href="/browse">
                <Button variant="primary" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Browse Items
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {dashboardData?.swaps.map((swap) => (
                <div key={swap.id} className="bg-white rounded-2xl shadow-soft border border-accent-200 overflow-hidden">
                  <div className="aspect-square bg-accent-50 relative overflow-hidden">
                    {swap.item.images && swap.item.images.length > 0 ? (
                      <Image 
                        src={swap.item.images[0]} 
                        alt={swap.item.title} 
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-accent-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-text-primary mb-2 line-clamp-2">
                      {swap.item.title}
                    </h3>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(swap.status)}`}>
                      {getStatusIcon(swap.status)}
                      {swap.status.toLowerCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 