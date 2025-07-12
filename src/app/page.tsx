"use client";

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Header } from '@/components/Header'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FeaturedItems } from '@/components/FeaturedItems'
import { 
  Leaf, 
  Users, 
  Heart, 
  Award, 
  ArrowRight,
  Search,
  TrendingUp,
  Shield,
  Globe
} from 'lucide-react'

function PublicLanding() {
  const [search, setSearch] = useState('')
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-section relative py-20">
        <div className="hero-pattern"></div>
        <div className="container-responsive relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-text-primary mb-6">
              Welcome to{' '}
              <span className="text-gradient">ReWear</span>
            </h1>
            <p className="text-xl text-text-secondary mb-8 leading-relaxed">
              Join our sustainable community where fashion meets environmental responsibility. 
              Swap, share, and discover pre-loved clothing while earning points and reducing waste.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for clothing items..."
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-accent-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cta-500 focus:border-transparent transition-all duration-200 bg-white shadow-soft"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button variant="primary" size="lg" className="group">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </Link>
              <Link href="/browse">
                <Button variant="outline" size="lg">
                  Start Browsing
                </Button>
              </Link>
              <Link href="/create-listing">
                <Button variant="outline" size="lg">
                  Start Sharing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-text-primary mb-4">
              Why Choose ReWear?
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Our platform combines sustainability, community, and smart technology to revolutionize how we think about fashion.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Leaf className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-text-primary mb-3">
                Sustainable Fashion
              </h3>
              <p className="text-text-secondary">
                Reduce environmental impact by giving clothes a second life through our community-driven platform.
              </p>
            </div>
            
            <div className="card p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-sage-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-sage-600" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-text-primary mb-3">
                Community First
              </h3>
              <p className="text-text-secondary">
                Connect with like-minded individuals who share your passion for sustainable living and fashion.
              </p>
            </div>
            
            <div className="card p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-cta-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-cta-600" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-text-primary mb-3">
                Earn Points
              </h3>
              <p className="text-text-secondary">
                Get rewarded for your contributions with our points system that lets you redeem items from the community.
              </p>
            </div>
            
            <div className="card p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-text-primary mb-3">
                Quality Assured
              </h3>
              <p className="text-text-secondary">
                All items are reviewed by our community to ensure quality and authenticity before listing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="py-20 bg-accent-50">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-text-primary mb-4">
              Featured Items
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Discover amazing pre-loved clothing from our community members
            </p>
          </div>
          
          <FeaturedItems />
          
          <div className="text-center mt-12">
            <Link href="/create-listing">
              <Button variant="primary" size="lg">
                Start Sharing Your Items
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container-responsive">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-heading font-bold text-primary-600 mb-2">
                1,000+
              </div>
              <div className="text-text-secondary text-lg">
                Community Members
              </div>
            </div>
            <div>
              <div className="text-4xl font-heading font-bold text-cta-600 mb-2">
                5,000+
              </div>
              <div className="text-text-secondary text-lg">
                Items Shared
              </div>
            </div>
            <div>
              <div className="text-4xl font-heading font-bold text-sage-600 mb-2">
                10,000+
              </div>
              <div className="text-text-secondary text-lg">
                Points Earned
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-500 to-cta-500">
        <div className="container-responsive text-center">
          <h2 className="text-4xl font-heading font-bold text-white mb-6">
            Ready to Join the Movement?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Start your sustainable fashion journey today and become part of a community that cares about the planet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button variant="secondary" size="lg">
                Create Account
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function UserLanding() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-section relative py-20">
        <div className="hero-pattern"></div>
        <div className="container-responsive relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-text-primary mb-6">
              Welcome back to{' '}
              <span className="text-gradient">ReWear</span>
            </h1>
            <p className="text-xl text-text-secondary mb-8 leading-relaxed">
              Continue your sustainable fashion journey. Discover new items, manage your listings, and grow your community impact.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/create-listing">
                <Button variant="primary" size="lg" className="group">
                  Create New Listing
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="py-20 bg-accent-50">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-text-primary mb-4">
              Featured Items
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Discover amazing pre-loved clothing from our community
            </p>
          </div>
          
          <FeaturedItems />
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-20 bg-white">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-text-primary mb-4">
              Quick Actions
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Everything you need to manage your ReWear experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/create-listing" className="card p-8 text-center hover-lift group">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                <TrendingUp className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-text-primary mb-3">
                Create Listing
              </h3>
              <p className="text-text-secondary mb-4">
                Share your pre-loved clothing with the community and start earning points.
              </p>
              <Button variant="primary" size="sm">
                Start Listing
              </Button>
            </Link>
            
            <Link href="/dashboard" className="card p-8 text-center hover-lift group">
              <div className="w-16 h-16 bg-sage-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                <Heart className="w-8 h-8 text-sage-600" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-text-primary mb-3">
                My Dashboard
              </h3>
              <p className="text-text-secondary mb-4">
                Track your listings, points, and swap history in one place.
              </p>
              <Button variant="outline" size="sm">
                View Dashboard
              </Button>
            </Link>
            
            <Link href="/browse" className="card p-8 text-center hover-lift group">
              <div className="w-16 h-16 bg-cta-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                <Globe className="w-8 h-8 text-cta-600" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-text-primary mb-3">
                Browse Items
              </h3>
              <p className="text-text-secondary mb-4">
                Discover amazing items from our community and find your next favorite piece.
              </p>
              <Button variant="outline" size="sm">
                Start Browsing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function HomePage() {
  const { data: session, status } = useSession()
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (session?.user) {
      // Fetch user data to check role
      fetch('/api/user/dashboard')
        .then(response => response.json())
        .then(data => {
          setUserRole(data.user?.role)
          setIsLoading(false)
          
          // Redirect admin users to admin page
          if (data.user?.role === 'ADMIN') {
            router.push('/admin')
          }
        })
        .catch(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [session, status, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If user is admin, don't render anything as they'll be redirected
  if (userRole === 'ADMIN') {
    return null
  }
  
  return session?.user ? <UserLanding /> : <PublicLanding />
} 