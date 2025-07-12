"use client";

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Header } from '@/components/Header'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { FeaturedItems } from '@/components/FeaturedItems'

function PublicLanding() {
  const [search, setSearch] = useState('')
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Hero Section with Search */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-primary-600">ReWear</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our community clothing exchange platform. Swap or redeem unused clothing through our sustainable fashion points system.
          </p>
          <form className="max-w-xl mx-auto flex items-center gap-2 mb-8" onSubmit={e => {e.preventDefault(); window.location.href = `/`}}>
            <input
              type="text"
              placeholder="Search for clothing..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Button type="submit" className="rounded-l-none rounded-r-md">🔍</Button>
          </form>
          {/* Carousel/Images */}
          <div className="w-full max-w-3xl mx-auto mb-8">
            <div className="h-56 bg-gray-200 rounded-lg flex items-center justify-center text-2xl text-gray-400">
              Images / Carousel (Coming Soon)
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
                Start Swapping
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Featured Items</h2>
          <FeaturedItems />
        </div>
      </section>
      
      {/* Optional: Testimonials/Impact */}
      <section className="py-10 bg-white border-t">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">What Our Community Says</h2>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center max-w-4xl mx-auto">
            <div className="bg-primary-50 rounded-lg p-6 shadow w-full md:w-1/3">
              <p className="text-lg italic mb-2">"I love swapping clothes on ReWear! It's easy and eco-friendly."</p>
              <span className="block text-sm text-primary-700 font-semibold">— Alex</span>
            </div>
            <div className="bg-primary-50 rounded-lg p-6 shadow w-full md:w-1/3">
              <p className="text-lg italic mb-2">"I've saved so much money and met great people."</p>
              <span className="block text-sm text-primary-700 font-semibold">— Jamie</span>
            </div>
            <div className="bg-primary-50 rounded-lg p-6 shadow w-full md:w-1/3">
              <p className="text-lg italic mb-2">"The points system makes it fair for everyone."</p>
              <span className="block text-sm text-primary-700 font-semibold">— Taylor</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function UserLanding() {
  const [search, setSearch] = useState('');
  const categories = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories'];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Search Bar */}
      <div className="bg-white border-b py-4">
        <form className="max-w-xl mx-auto flex items-center gap-2" onSubmit={e => {e.preventDefault();}}>
          <input
            type="text"
            placeholder="Search for clothing..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Button type="submit" className="rounded-l-none rounded-r-md">🔍</Button>
        </form>
      </div>
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Carousel */}
        <div className="mb-8">
          <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center text-2xl text-gray-400">
            Images / Carousel (Coming Soon)
          </div>
        </div>
        {/* Categories Section */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-700 mb-3 text-center">Categories Section</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 max-w-3xl mx-auto">
            {categories.map((cat) => (
              <button key={cat} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 flex items-center justify-center text-lg font-semibold text-primary-700 cursor-pointer border border-primary-100 hover:bg-primary-50 w-full">
                {cat}
              </button>
            ))}
          </div>
        </div>
        {/* Featured Products Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Featured Items</h2>
          <FeaturedItems />
        </div>
      </main>
    </div>
  )
}

export default function HomePage() {
  const { data: session, status } = useSession();
  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center text-xl">Loading...</div>;
  }
  if (session?.user) {
    return <UserLanding />;
  }
  return <PublicLanding />;
} 