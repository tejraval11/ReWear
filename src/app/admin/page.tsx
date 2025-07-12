"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { useToaster } from '@/components/ui/Toaster'
import { Header } from '@/components/Header'
import Image from 'next/image'

interface PendingItem {
  id: string
  title: string
  description: string
  category: string
  size: string
  condition: string
  tags: string[]
  images: string[]
  owner: {
    id: string
    name: string
    email: string
    avatarUrl?: string
  }
  createdAt: string
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { addToast } = useToaster()
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session || !('user' in session) || !session.user || !('role' in session.user) || !session.user.role) {
      router.push('/login')
      return
    }
    if (session.user.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }
    fetchPendingItems()
  }, [session, status, router])

  const fetchPendingItems = async () => {
    try {
      const response = await fetch('/api/admin/pending-items')
      if (response.ok) {
        const data = await response.json()
        setPendingItems(data.items)
      }
    } catch {
      addToast('Error loading pending items', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (itemId: string, action: 'APPROVE' | 'REJECT' | 'DELETE') => {
    setActionLoading(itemId)
    try {
      const response = await fetch('/api/items/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId, action }),
      })
      const data = await response.json()
      if (response.ok) {
        addToast(`Item ${action.toLowerCase()}d successfully`, 'success')
        fetchPendingItems() // Refresh the list
      } else {
        addToast(data.message || `Failed to ${action.toLowerCase()} item`, 'error')
      }
    } catch {
      addToast(`Error ${action.toLowerCase()}ing item`, 'error')
    } finally {
      setActionLoading(null)
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

  if (!session || !session.user || !('role' in session.user) || !session.user.role || session.user.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-[#18181b]">
      <Header />
      {/* Search Bar */}
      <div className="bg-[#232326] border-b border-gray-800 py-4">
        <form className="max-w-xl mx-auto flex items-center gap-2" onSubmit={e => {e.preventDefault();}}>
          <input
            type="text"
            placeholder="Search users/items..."
            className="flex-1 px-4 py-2 bg-[#18181b] border border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-100 placeholder-gray-400"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Button type="submit" className="rounded-l-none rounded-r-md">🔍</Button>
        </form>
      </div>
      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-100 mb-8 text-center">Admin Panel</h1>
        {/* Management Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <Button className="bg-[#232326] text-gray-100 border border-gray-700 px-6 py-2 rounded-lg">Manage User</Button>
          <Button className="bg-[#232326] text-gray-100 border border-gray-700 px-6 py-2 rounded-lg">Manage Orders</Button>
          <Button className="bg-[#232326] text-gray-100 border border-gray-700 px-6 py-2 rounded-lg">Manage Listings</Button>
        </div>
        <div className="bg-[#232326] rounded-xl shadow-lg p-6 border border-gray-800">
          <h2 className="text-lg font-bold text-gray-200 mb-6">Manage Users</h2>
          {pendingItems.length === 0 ? (
            <div className="text-gray-500 text-center py-8">No users/items to review.</div>
          ) : (
            <div className="flex flex-col gap-6">
              {pendingItems.filter(item => item.owner.name.toLowerCase().includes(search.toLowerCase()) || item.owner.email.toLowerCase().includes(search.toLowerCase())).map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row items-center gap-6 bg-[#18181b] rounded-lg p-4 border border-gray-700">
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                    {item.owner.avatarUrl ? (
                      <Image src={item.owner.avatarUrl} alt="Avatar" width={80} height={80} className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-3xl text-gray-300 font-bold">{item.owner.name ? item.owner.name[0].toUpperCase() : (item.owner.email ? item.owner.email[0].toUpperCase() : "U")}</span>
                    )}
                  </div>
                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="text-gray-100 font-semibold text-lg mb-1">{item.owner.name}</div>
                    <div className="text-gray-400 text-sm mb-2">{item.owner.email}</div>
                    <div className="text-gray-300 text-sm mb-2 line-clamp-2">{item.title} - {item.description}</div>
                    <div className="flex gap-4 text-xs text-gray-400">
                      <span>Category: <b className="text-gray-200">{item.category}</b></span>
                      <span>Size: <b className="text-gray-200">{item.size}</b></span>
                      <span>Condition: <b className="text-gray-200">{item.condition}</b></span>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex flex-col gap-2 min-w-[140px]">
                    <Button
                      size="sm"
                      onClick={() => handleAction(item.id, 'APPROVE')}
                      disabled={actionLoading === item.id}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {actionLoading === item.id ? 'Processing...' : 'Actions 1'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction(item.id, 'REJECT')}
                      disabled={actionLoading === item.id}
                      className="border-yellow-500 text-yellow-400 hover:bg-yellow-900"
                    >
                      {actionLoading === item.id ? 'Processing...' : 'Actions 2'}
                    </Button>
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