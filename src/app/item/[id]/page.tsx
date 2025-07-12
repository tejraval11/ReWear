"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { useToaster } from "@/components/ui/Toaster";
import { 
  Calendar, 
  User, 
  Tag, 
  Ruler, 
  Star, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Heart,
  Coins,
  ArrowLeft
} from "lucide-react";

interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  size: string;
  condition: string;
  tags: string[];
  images: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
}

export default function ItemDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { addToast } = useToaster();
  
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    async function fetchItem() {
      setLoading(true);
      try {
        const res = await fetch(`/api/items/${id}`);
        if (res.ok) {
          const data = await res.json();
          setItem(data.item);
        } else {
          addToast('Item not found', 'error');
          router.push('/');
        }
             } catch {
         addToast('Error loading item', 'error');
       } finally {
        setLoading(false);
      }
    }

    if (id) fetchItem();
  }, [id, router, addToast]);

  useEffect(() => {
    async function fetchUserPoints() {
      if (session?.user) {
        try {
          const res = await fetch('/api/user/dashboard');
          if (res.ok) {
            const data = await res.json();
            setUserPoints(data.user.points);
          }
                 } catch {
           console.error('Error fetching user points');
         }
      }
    }

    fetchUserPoints();
  }, [session]);

  const handleSwapRequest = async () => {
    if (!session?.user) {
      addToast('Please log in to request a swap', 'error');
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch('/api/swap/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item?.id }),
      });

      const data = await response.json();
      
      if (response.ok) {
        addToast('Swap request sent successfully!', 'success');
      } else {
        addToast(data.message || 'Failed to send swap request', 'error');
      }
         } catch {
       addToast('Error sending swap request', 'error');
     } finally {
      setActionLoading(false);
    }
  };

  const handleRedeemWithPoints = async () => {
    if (!session?.user) {
      addToast('Please log in to redeem this item', 'error');
      return;
    }

    if (userPoints < 10) {
      addToast('You need at least 10 points to redeem this item', 'error');
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch('/api/items/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item?.id }),
      });

      const data = await response.json();
      
      if (response.ok) {
        addToast('Item redeemed successfully!', 'success');
        setUserPoints(prev => prev - 10);
        // Refresh the page to show updated ownership
        window.location.reload();
      } else {
        addToast(data.message || 'Failed to redeem item', 'error');
      }
    } catch {
      addToast('Error redeeming item', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return { 
          icon: <CheckCircle className="w-5 h-5 text-green-500" />, 
          text: 'Available', 
          color: 'text-green-500',
          bgColor: 'bg-green-100',
          borderColor: 'border-green-200'
        };
      case 'PENDING':
        return { 
          icon: <Clock className="w-5 h-5 text-yellow-500" />, 
          text: 'Pending Review', 
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          borderColor: 'border-yellow-200'
        };
      case 'REJECTED':
        return { 
          icon: <XCircle className="w-5 h-5 text-red-500" />, 
          text: 'Rejected', 
          color: 'text-red-500',
          bgColor: 'bg-red-100',
          borderColor: 'border-red-200'
        };
      default:
        return { 
          icon: <AlertCircle className="w-5 h-5 text-gray-500" />, 
          text: 'Unknown', 
          color: 'text-gray-500',
          bgColor: 'bg-gray-100',
          borderColor: 'border-gray-200'
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Item not found</h1>
          <Link href="/" className="text-primary-600 hover:text-primary-700">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(item.status);
  const isOwner = session?.user?.id === item.owner.id;
  const canInteract = item.status === 'APPROVED' && !isOwner && session?.user;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-600 flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900">{item.title}</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {item.images && item.images.length > 0 ? (
                <div className="relative aspect-square">
                  <Image
                    src={item.images[currentImageIndex]}
                    alt={`${item.title} - Image ${currentImageIndex + 1}`}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Tag className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No images available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {item.images && item.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden ${
                      currentImageIndex === index
                        ? 'border-primary-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Title and Status */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${statusInfo.bgColor} ${statusInfo.borderColor}`}>
                  {statusInfo.icon}
                  <span className={`text-sm font-medium ${statusInfo.color}`}>
                    {statusInfo.text}
                  </span>
                </div>
              </div>
              <p className="text-gray-600">Listed on {formatDate(item.createdAt)}</p>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {item.description || 'No description provided.'}
              </p>
            </div>

            {/* Item Details */}
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Item Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Tag className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium text-gray-900">{item.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Ruler className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Size</p>
                    <p className="font-medium text-gray-900">{item.size}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Condition</p>
                    <p className="font-medium text-gray-900">{item.condition}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Listed</p>
                    <p className="font-medium text-gray-900">{formatDate(item.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Uploader Information */}
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploader Information</h3>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{item.owner.name}</p>
                  <p className="text-sm text-gray-500">{item.owner.email}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {canInteract && (
              <div className="bg-white rounded-lg p-6 border space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Get This Item</h3>
                
                {/* Points Display */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Coins className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm text-gray-600">Your Points:</span>
                  </div>
                  <span className="font-semibold text-gray-900">{userPoints}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    onClick={handleSwapRequest}
                    disabled={actionLoading}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                  >
                    {actionLoading ? 'Processing...' : (
                      <>
                        <Heart className="w-4 h-4 mr-2" />
                        Request Swap
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={handleRedeemWithPoints}
                    disabled={actionLoading || userPoints < 10}
                    className={`w-full ${
                      userPoints >= 10
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {actionLoading ? 'Processing...' : (
                      <>
                        <Coins className="w-4 h-4 mr-2" />
                        Redeem (10 pts)
                      </>
                    )}
                  </Button>
                </div>

                {userPoints < 10 && (
                  <p className="text-sm text-gray-500 text-center">
                    You need at least 10 points to redeem this item
                  </p>
                )}
              </div>
            )}

            {isOwner && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-center">
                  This is your item. You can view it in your dashboard.
                </p>
              </div>
            )}

            {!session?.user && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-center">
                  Please log in to interact with this item.
                </p>
                <div className="mt-3 flex space-x-3">
                  <Link href="/login" className="flex-1">
                    <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/signup" className="flex-1">
                    <Button className="w-full bg-gray-600 hover:bg-gray-700 text-white">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 