"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { useToaster } from '@/components/ui/Toaster'
import { Header } from '@/components/Header'
import Image from 'next/image'
import { 
  Shield, 
  Users, 
  Package, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Eye, 
  AlertTriangle,
  Clock,
  TrendingUp,
  UserCheck,
  UserX,
  Settings,
  BarChart3,
  RefreshCw,
  ArrowRight,
  ShoppingBag
} from 'lucide-react'

interface Item {
  id: string
  title: string
  description: string
  category: string
  size: string
  condition: string
  tags: string[]
  images: string[]
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  updatedAt: string
  owner: {
    id: string
    name: string
    email: string
    points: number
  }
}

interface User {
  id: string
  name: string
  email: string
  role: string
  points: number
  createdAt: string
  _count: {
    items: number
    swaps: number
  }
}

interface Swap {
  id: string
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED'
  createdAt: string
  updatedAt: string
  item: {
    id: string
    title: string
    images: string[]
    category: string
    size: string
    condition: string
  }
  fromUser: {
    id: string
    name: string
    email: string
    points: number
  }
  toUser: {
    id: string
    name: string
    email: string
    points: number
  }
}

interface DashboardStats {
  totalUsers: number
  totalItems: number
  pendingItems: number
  approvedItems: number
  rejectedItems: number
  totalSwaps: number
  pendingSwaps: number
}

type TabType = 'overview' | 'items' | 'users' | 'swaps' | 'moderation'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { addToast } = useToaster()
  
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [items, setItems] = useState<Item[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [swaps, setSwaps] = useState<Swap[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user || session.user.role !== 'ADMIN') {
      router.push('/login')
      return
    }
    fetchDashboardData()
  }, [session, status, router])

  useEffect(() => {
    if (activeTab === 'items') {
      fetchItems()
    } else if (activeTab === 'users') {
      fetchUsers()
    } else if (activeTab === 'swaps') {
      fetchSwaps()
    }
  }, [activeTab, search, statusFilter, currentPage])

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const statsResponse = await fetch('/api/admin/stats')
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }
      
      // Fetch initial items
      await fetchItems()
    } catch {
      addToast('Error loading dashboard data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const fetchItems = async () => {
    try {
      const params = new URLSearchParams({
        status: statusFilter,
        search: search,
        page: currentPage.toString(),
        limit: '10'
      })
      
      const response = await fetch(`/api/admin/all-items?${params}`)
      if (response.ok) {
        const data = await response.json()
        setItems(data.items)
        setTotalPages(data.totalPages)
      }
    } catch {
      addToast('Error loading items', 'error')
    }
  }

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams({
        search: search,
        page: currentPage.toString(),
        limit: '10'
      })
      
      const response = await fetch(`/api/admin/users?${params}`)
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
        setTotalPages(data.totalPages)
      }
    } catch {
      addToast('Error loading users', 'error')
    }
  }

  const fetchSwaps = async () => {
    try {
      const params = new URLSearchParams({
        status: statusFilter,
        search: search,
        page: currentPage.toString(),
        limit: '10'
      })
      
      const response = await fetch(`/api/admin/swaps?${params}`)
      if (response.ok) {
        const data = await response.json()
        setSwaps(data.swaps)
        setTotalPages(data.totalPages)
      }
    } catch {
      addToast('Error loading swaps', 'error')
    }
  }

  const handleItemAction = async (itemId: string, action: 'APPROVE' | 'REJECT' | 'DELETE') => {
    setActionLoading(itemId)
    try {
      const response = await fetch('/api/items/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, action }),
      })
      const data = await response.json()
      
      if (response.ok) {
        addToast(`Item ${action.toLowerCase()}d successfully`, 'success')
        fetchItems() // Refresh the list
        fetchDashboardData() // Refresh stats
      } else {
        addToast(data.message || `Failed to ${action.toLowerCase()} item`, 'error')
      }
    } catch {
      addToast(`Error ${action.toLowerCase()}ing item`, 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleUserAction = async (userId: string, action: 'SUSPEND' | 'ACTIVATE' | 'DELETE') => {
    setActionLoading(userId)
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      })
      const data = await response.json()
      
      if (response.ok) {
        addToast(`User ${action.toLowerCase()}d successfully`, 'success')
        fetchUsers() // Refresh the list
        fetchDashboardData() // Refresh stats
      } else {
        addToast(data.message || `Failed to ${action.toLowerCase()} user`, 'error')
      }
    } catch {
      addToast(`Error ${action.toLowerCase()}ing user`, 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleSwapAction = async (swapId: string, action: 'APPROVE' | 'REJECT' | 'CANCEL') => {
    setActionLoading(swapId)
    try {
      const response = await fetch('/api/admin/swaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ swapId, action }),
      })
      const data = await response.json()
      
      if (response.ok) {
        addToast(`Swap ${action.toLowerCase()}d successfully`, 'success')
        fetchSwaps() // Refresh the list
        fetchDashboardData() // Refresh stats
      } else {
        addToast(data.message || `Failed to ${action.toLowerCase()} swap`, 'error')
      }
    } catch {
      addToast(`Error ${action.toLowerCase()}ing swap`, 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return { 
          icon: <CheckCircle className="w-4 h-4 text-green-500" />, 
          text: 'Approved', 
          color: 'text-green-500',
          bgColor: 'bg-green-100',
          borderColor: 'border-green-200'
        }
      case 'PENDING':
        return { 
          icon: <Clock className="w-4 h-4 text-yellow-500" />, 
          text: 'Pending', 
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          borderColor: 'border-yellow-200'
        }
      case 'REJECTED':
        return { 
          icon: <XCircle className="w-4 h-4 text-red-500" />, 
          text: 'Rejected', 
          color: 'text-red-500',
          bgColor: 'bg-red-100',
          borderColor: 'border-red-200'
        }
      default:
        return { 
          icon: <AlertTriangle className="w-4 h-4 text-gray-500" />, 
          text: 'Unknown', 
          color: 'text-gray-500',
          bgColor: 'bg-gray-100',
          borderColor: 'border-gray-200'
        }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!session?.user || session.user.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600 mt-1">Manage your ReWear community</p>
          </div>
          <Button 
            onClick={fetchDashboardData}
            className="bg-primary-600 hover:bg-primary-700 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 mb-8 border">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('items')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'items'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Package className="w-4 h-4 mr-2" />
            Items
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            Users
          </button>
          <button
            onClick={() => setActiveTab('swaps')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'swaps'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Swaps
          </button>
          <button
            onClick={() => setActiveTab('moderation')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'moderation'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Shield className="w-4 h-4 mr-2" />
            Moderation
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-white rounded-lg p-6 border shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 border shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Items</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 border shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Review</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingItems}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 border shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <ShoppingBag className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Swaps</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingSwaps}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 border shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Swaps</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalSwaps}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg p-6 border shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button
                  onClick={() => setActiveTab('items')}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Review Items
                </Button>
                <Button
                  onClick={() => setActiveTab('swaps')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Manage Swaps
                </Button>
                <Button
                  onClick={() => setActiveTab('users')}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Manage Users
                </Button>
                <Button
                  onClick={() => setActiveTab('moderation')}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Moderation
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Items Tab */}
        {activeTab === 'items' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-lg p-6 border shadow-sm">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search items by title, description, or owner..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="ALL">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Item Management</h3>
              </div>
              
              {items.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No items found matching your criteria.
                </div>
              ) : (
                <div className="divide-y">
                  {items.map((item) => {
                    const statusInfo = getStatusInfo(item.status)
                    return (
                      <div key={item.id} className="p-6 hover:bg-gray-50">
                        <div className="flex items-start space-x-4">
                          {/* Item Image */}
                          <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                            {item.images && item.images.length > 0 ? (
                              <Image
                                src={item.images[0]}
                                alt={item.title}
                                width={80}
                                height={80}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Package className="w-6 h-6" />
                              </div>
                            )}
                          </div>

                          {/* Item Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="text-lg font-medium text-gray-900">{item.title}</h4>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                              </div>
                              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${statusInfo.bgColor} ${statusInfo.borderColor}`}>
                                {statusInfo.icon}
                                <span className={`text-sm font-medium ${statusInfo.color}`}>
                                  {statusInfo.text}
                                </span>
                              </div>
                            </div>
                            
                            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                              <span>Category: {item.category}</span>
                              <span>Size: {item.size}</span>
                              <span>Condition: {item.condition}</span>
                              <span>Listed: {formatDate(item.createdAt)}</span>
                            </div>
                            
                            <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
                              <UserCheck className="w-4 h-4" />
                              <span>{item.owner.name} ({item.owner.email})</span>
                              <span>• {item.owner.points} points</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col space-y-2">
                            <Button
                              size="sm"
                              onClick={() => router.push(`/item/${item.id}`)}
                              className="bg-gray-600 hover:bg-gray-700 text-white"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            
                            {item.status === 'PENDING' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleItemAction(item.id, 'APPROVE')}
                                  disabled={actionLoading === item.id}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  {actionLoading === item.id ? 'Processing...' : (
                                    <>
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                      Approve
                                    </>
                                  )}
                                </Button>
                                
                                <Button
                                  size="sm"
                                  onClick={() => handleItemAction(item.id, 'REJECT')}
                                  disabled={actionLoading === item.id}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  {actionLoading === item.id ? 'Processing...' : (
                                    <>
                                      <XCircle className="w-4 h-4 mr-1" />
                                      Reject
                                    </>
                                  )}
                                </Button>
                              </>
                            )}
                            
                            <Button
                              size="sm"
                              onClick={() => handleItemAction(item.id, 'DELETE')}
                              disabled={actionLoading === item.id}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              {actionLoading === item.id ? 'Processing...' : (
                                <>
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Delete
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2">
                <Button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="bg-gray-600 hover:bg-gray-700 text-white"
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 py-2 text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="bg-gray-600 hover:bg-gray-700 text-white"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Search */}
            <div className="bg-white rounded-lg p-6 border shadow-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Users List */}
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
              </div>
              
              {users.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No users found matching your criteria.
                </div>
              ) : (
                <div className="divide-y">
                  {users.map((user) => (
                    <div key={user.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 font-semibold text-lg">
                              {user.name[0].toUpperCase()}
                            </span>
                          </div>
                          
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">{user.name}</h4>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                              <span>Role: {user.role}</span>
                              <span>Points: {user.points}</span>
                              <span>Items: {user._count.items}</span>
                              <span>Swaps: {user._count.swaps}</span>
                              <span>Joined: {formatDate(user.createdAt)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleUserAction(user.id, 'SUSPEND')}
                            disabled={actionLoading === user.id}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white"
                          >
                            {actionLoading === user.id ? 'Processing...' : (
                              <>
                                <UserX className="w-4 h-4 mr-1" />
                                Suspend
                              </>
                            )}
                          </Button>
                          
                          <Button
                            size="sm"
                            onClick={() => handleUserAction(user.id, 'DELETE')}
                            disabled={actionLoading === user.id}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            {actionLoading === user.id ? 'Processing...' : (
                              <>
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2">
                <Button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="bg-gray-600 hover:bg-gray-700 text-white"
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 py-2 text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="bg-gray-600 hover:bg-gray-700 text-white"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Swaps Tab */}
        {activeTab === 'swaps' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-lg p-6 border shadow-sm">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search swaps by item title, user name, or status..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="ALL">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Swaps List */}
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Swap Management</h3>
              </div>
              
              {swaps.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No swaps found matching your criteria.
                </div>
              ) : (
                <div className="divide-y">
                  {swaps.map((swap) => {
                    const statusInfo = getStatusInfo(swap.status)
                    return (
                      <div key={swap.id} className="p-6 hover:bg-gray-50">
                        <div className="flex items-start space-x-4">
                          {/* Item Image */}
                          <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                            {swap.item.images && swap.item.images.length > 0 ? (
                              <Image
                                src={swap.item.images[0]}
                                alt={swap.item.title}
                                width={80}
                                height={80}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Package className="w-6 h-6" />
                              </div>
                            )}
                          </div>

                          {/* Swap Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="text-lg font-medium text-gray-900">{swap.item.title}</h4>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                  From: {swap.fromUser.name} ({swap.fromUser.email})
                                </p>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                  To: {swap.toUser.name} ({swap.toUser.email})
                                </p>
                              </div>
                              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${statusInfo.bgColor} ${statusInfo.borderColor}`}>
                                {statusInfo.icon}
                                <span className={`text-sm font-medium ${statusInfo.color}`}>
                                  {statusInfo.text}
                                </span>
                              </div>
                            </div>
                            
                            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                              <span>Item: {swap.item.title}</span>
                              <span>Category: {swap.item.category}</span>
                              <span>Size: {swap.item.size}</span>
                              <span>Condition: {swap.item.condition}</span>
                              <span>Created: {formatDate(swap.createdAt)}</span>
                            </div>
                            
                            <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
                              <span>From User: {swap.fromUser.name} ({swap.fromUser.email})</span>
                              <span>• {swap.fromUser.points} points</span>
                              <span>To User: {swap.toUser.name} ({swap.toUser.email})</span>
                              <span>• {swap.toUser.points} points</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col space-y-2">
                            {swap.status === 'PENDING' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleSwapAction(swap.id, 'APPROVE')}
                                  disabled={actionLoading === swap.id}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  {actionLoading === swap.id ? 'Processing...' : (
                                    <>
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                      Approve
                                    </>
                                  )}
                                </Button>
                                
                                <Button
                                  size="sm"
                                  onClick={() => handleSwapAction(swap.id, 'REJECT')}
                                  disabled={actionLoading === swap.id}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  {actionLoading === swap.id ? 'Processing...' : (
                                    <>
                                      <XCircle className="w-4 h-4 mr-1" />
                                      Reject
                                    </>
                                  )}
                                </Button>
                              </>
                            )}
                            {swap.status === 'PENDING' && (
                              <Button
                                size="sm"
                                onClick={() => handleSwapAction(swap.id, 'CANCEL')}
                                disabled={actionLoading === swap.id}
                                className="bg-gray-600 hover:bg-gray-700 text-white"
                              >
                                {actionLoading === swap.id ? 'Processing...' : (
                                  <>
                                    <ArrowRight className="w-4 h-4 mr-1" />
                                    Cancel Swap
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2">
                <Button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="bg-gray-600 hover:bg-gray-700 text-white"
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 py-2 text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="bg-gray-600 hover:bg-gray-700 text-white"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Moderation Tab */}
        {activeTab === 'moderation' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Moderation Tools</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Content Moderation</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Review and moderate user-generated content including item listings and descriptions.
                  </p>
                  <Button
                    onClick={() => setActiveTab('items')}
                    className="bg-primary-600 hover:bg-primary-700 text-white"
                  >
                    Review Items
                  </Button>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">User Management</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Manage user accounts, suspend problematic users, and maintain community standards.
                  </p>
                  <Button
                    onClick={() => setActiveTab('users')}
                    className="bg-gray-600 hover:bg-gray-700 text-white"
                  >
                    Manage Users
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
} 