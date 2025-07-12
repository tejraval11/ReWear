"use client"

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { useToaster } from '@/components/ui/Toaster'
import { UploadButton } from '@uploadthing/react'

const categories = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories']
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor']

export default function CreateListingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { addToast } = useToaster()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    size: '',
    condition: '',
    tags: '',
  })
  const [imageUrls, setImageUrls] = useState<string[]>([])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    router.push('/login')
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleUploadComplete = (res: any) => {
    console.log('UploadThing response:', res)
    if (res && Array.isArray(res)) {
      const urls = res.map((file: any) => file.url)
      console.log('Extracted image URLs:', urls)
      setImageUrls(urls)
      addToast('Images uploaded successfully!', 'success')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (imageUrls.length === 0) {
        addToast('Please upload at least one image.', 'error')
        setLoading(false)
        return
      }
      
      console.log('Submitting item with image URLs:', imageUrls)
      
      const response = await fetch('/api/items/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          images: imageUrls,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        console.log('Item created successfully:', data.item)
        addToast('Item uploaded successfully! It will be reviewed by our team.', 'success')
        router.push('/dashboard')
      } else {
        addToast(data.message || 'Failed to upload item', 'error')
      }
    } catch {
      addToast('Error uploading item', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Listing</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Item Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Vintage Denim Jacket"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Describe your item in detail..."
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            {/* Category and Size */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
                  Size *
                </label>
                <select
                  id="size"
                  name="size"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={formData.size}
                  onChange={handleInputChange}
                >
                  <option value="">Select a size</option>
                  {sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* Condition */}
            <div>
              <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
                Condition *
              </label>
              <select
                id="condition"
                name="condition"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={formData.condition}
                onChange={handleInputChange}
              >
                <option value="">Select condition</option>
                {conditions.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
            </div>
            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., vintage, denim, casual"
                value={formData.tags}
                onChange={handleInputChange}
              />
              <p className="text-sm text-gray-500 mt-1">
                Add relevant tags to help others find your item
              </p>
            </div>
            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images (up to 4)
              </label>
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={handleUploadComplete}
                onUploadError={() => addToast('Image upload failed', 'error')}
                appearance={{
                  button: 'bg-primary-600 text-white rounded px-4 py-2',
                  container: 'mb-2',
                }}
                multiple={true}
                maxFiles={4}
              />
              <p className="text-sm text-gray-500 mt-1">
                Upload clear photos of your item. First image will be the main photo.
              </p>
              {imageUrls.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    Uploaded {imageUrls.length} image(s)
                  </p>
                </div>
              )}
            </div>
            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Creating Listing...' : 'Create Listing'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 