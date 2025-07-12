"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import Image from 'next/image'

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

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#18181b]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session || !session.user) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#18181b]">
      <Header />
      <div className="max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-gray-100 mb-8 text-center">User Dashboard</h1>
        {/* Top Section: Avatar, Info, Stats, Info Box */}
        <div className="bg-[#232326] rounded-xl shadow-lg p-8 flex flex-col md:flex-row gap-8 mb-10 border border-gray-800">
          {/* Avatar */}
          <div className="flex flex-col items-center md:items-start min-w-[120px]">
            <div className="w-28 h-28 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden mb-4">
              {dashboardData?.user.avatarUrl ? (
                <Image src={dashboardData.user.avatarUrl} alt="Avatar" width={112} height={112} className="object-cover w-full h-full" />
              ) : (
                <span className="text-5xl text-gray-300 font-bold">
                  {dashboardData?.user.name ? dashboardData.user.name[0].toUpperCase() : (dashboardData?.user.email ? dashboardData.user.email[0].toUpperCase() : "U")}
                </span>
              )}
            </div>
            <div className="text-lg text-gray-200 font-semibold">{dashboardData?.user.name || dashboardData?.user.email}</div>
            <div className="text-xs text-gray-400">{dashboardData?.user.email}</div>
          </div>
          {/* Stats and Info */}
          <div className="flex-1 flex flex-col gap-4 justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-2">
              <div className="bg-[#18181b] rounded-lg p-4 flex flex-col items-center border border-gray-700">
                <span className="text-gray-400 text-xs mb-1">Points</span>
                <span className="text-2xl font-bold text-primary-400">{dashboardData?.user.points || 0}</span>
              </div>
              <div className="bg-[#18181b] rounded-lg p-4 flex flex-col items-center border border-gray-700">
                <span className="text-gray-400 text-xs mb-1">Listings</span>
                <span className="text-2xl font-bold text-primary-400">{dashboardData?.items.length || 0}</span>
              </div>
              <div className="bg-[#18181b] rounded-lg p-4 flex flex-col items-center border border-gray-700">
                <span className="text-gray-400 text-xs mb-1">Active Swaps</span>
                <span className="text-2xl font-bold text-primary-400">{dashboardData?.swaps.filter(s => s.status === 'PENDING').length || 0}</span>
              </div>
            </div>
            {/* Info Box */}
            <div className="bg-[#18181b] rounded-lg p-4 border border-gray-700 text-gray-300 min-h-[80px] mt-2">
              Welcome back, <span className="font-semibold text-primary-400">{dashboardData?.user.name || dashboardData?.user.email}</span>! Here you can manage your listings, swaps, and see your points balance.
            </div>
          </div>
        </div>
        {/* My Listings */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-200 mb-3">My Listings</h2>
          {dashboardData?.items.length === 0 ? (
            <p className="text-gray-500 text-center py-4">You haven&apos;t uploaded any items yet.</p>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-2">
              {dashboardData?.items.map((item) => (
                <Link key={item.id} href={`/item/${item.id}`} className="block min-w-[180px] max-w-[180px]">
                  <div className="bg-[#232326] rounded-lg shadow p-4 border border-gray-700 flex flex-col items-center hover:shadow-xl transition-shadow">
                    <div className="w-28 h-28 bg-black rounded mb-3 flex items-center justify-center overflow-hidden">
                      {item.images && item.images.length > 0 ? (
                        <Image 
                          src={item.images[0]} 
                          alt={item.title} 
                          width={112} 
                          height={112} 
                          className="object-cover w-full h-full"
                          onError={() => {
                            console.error('Dashboard image failed to load:', item.images?.[0]);
                          }}
                          onLoad={() => {
                            console.log('Dashboard image loaded successfully:', item.images?.[0]);
                          }}
                        />
                      ) : (
                        <span className="text-gray-500">No Image</span>
                      )}
                    </div>
                    <div className="text-gray-100 font-semibold text-center line-clamp-2 mb-1">{item.title}</div>
                    <div className="text-xs text-gray-400 capitalize">{item.status.toLowerCase()}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        {/* My Purchases */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-200 mb-3">My Purchases</h2>
          {dashboardData?.swaps.length === 0 ? (
            <p className="text-gray-500 text-center py-4">You haven&apos;t made any purchases yet.</p>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-2">
              {dashboardData?.swaps.map((swap) => (
                <div key={swap.id} className="block min-w-[180px] max-w-[180px]">
                  <div className="bg-[#232326] rounded-lg shadow p-4 border border-gray-700 flex flex-col items-center hover:shadow-xl transition-shadow">
                    <div className="w-28 h-28 bg-black rounded mb-3 flex items-center justify-center overflow-hidden">
                      {swap.item.images && swap.item.images.length > 0 ? (
                        <Image src={swap.item.images[0]} alt={swap.item.title} width={112} height={112} className="object-cover w-full h-full" />
                      ) : (
                        <span className="text-gray-500">No Image</span>
                      )}
                    </div>
                    <div className="text-gray-100 font-semibold text-center line-clamp-2 mb-1">{swap.item.title}</div>
                    <div className="text-xs text-gray-400 capitalize">{swap.status.toLowerCase()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 