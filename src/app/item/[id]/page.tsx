"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";

export default function ItemDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [previousListings, setPreviousListings] = useState<any[]>([]);

  useEffect(() => {
    async function fetchItem() {
      setLoading(true);
      const res = await fetch(`/api/items/${id}`);
      if (res.ok) {
        const data = await res.json();
        setItem(data.item);
        setMainImage(data.item.images?.[0] || null);
        // Fetch previous listings by the same owner
        if (data.item.owner?.id) {
          fetch(`/api/items/browse?ownerId=${data.item.owner.id}`)
            .then(r => r.json())
            .then(d => {
              setPreviousListings((d.items || []).filter((i: any) => i.id !== data.item.id));
            });
        }
      }
      setLoading(false);
    }
    if (id) fetchItem();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl bg-[#18181b] text-gray-200">Loading...</div>;
  }
  if (!item) {
    return <div className="min-h-screen flex items-center justify-center text-xl bg-[#18181b] text-gray-200">Item not found.</div>;
  }

  return (
    <div className="min-h-screen bg-[#18181b]">
      <Header />
      {/* Search Bar */}
      <div className="bg-[#232326] border-b border-gray-800 py-4">
        <form className="max-w-xl mx-auto flex items-center gap-2" onSubmit={e => {e.preventDefault(); window.location.href = `/browse?search=${encodeURIComponent(search)}`}}>
          <input
            type="text"
            placeholder="Search for clothing..."
            className="flex-1 px-4 py-2 bg-[#18181b] border border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-100 placeholder-gray-400"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Button type="submit" className="rounded-l-none rounded-r-md">🔍</Button>
        </form>
      </div>
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-100 mb-8 text-center">Product Detail Page</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Main Product Image */}
          <div>
            <div className="bg-black rounded-lg shadow p-4 flex items-center justify-center min-h-[350px]">
              {mainImage ? (
                <Image 
                  src={mainImage} 
                  alt={item.title} 
                  width={350} 
                  height={350} 
                  className="object-contain rounded"
                  onError={() => {
                    console.error('Item detail image failed to load:', mainImage);
                  }}
                  onLoad={() => {
                    console.log('Item detail image loaded successfully:', mainImage);
                  }}
                />
              ) : (
                <div className="w-full h-[350px] flex items-center justify-center text-gray-500">Add Images</div>
              )}
            </div>
            {/* Image Gallery */}
            {item.images && item.images.length > 1 && (
              <div className="mt-4">
                <div className="text-xs text-gray-400 mb-1 ml-1">Product Images</div>
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {item.images.map((img: string, idx: number) => (
                    <button
                      key={img}
                      className={`border rounded-lg p-1 ${mainImage === img ? "border-primary-600" : "border-gray-700"}`}
                      onClick={() => setMainImage(img)}
                    >
                      <Image src={img} alt={`Image ${idx + 1}`} width={60} height={60} className="object-cover rounded" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Product Info */}
          <div className="flex flex-col gap-4">
            <div className="bg-[#232326] rounded-lg p-6 border border-gray-800">
              <h2 className="text-xl font-bold text-gray-100 mb-2">{item.title}</h2>
              <div className="text-gray-300 whitespace-pre-line mb-4">{item.description || <span className="italic text-gray-500">Add Product Description</span>}</div>
              <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-4">
                <span>Category: <b className="text-gray-200">{item.category}</b></span>
                <span>Size: <b className="text-gray-200">{item.size}</b></span>
                <span>Condition: <b className="text-gray-200">{item.condition}</b></span>
              </div>
              <div className="flex justify-end">
                <Button size="md" className="bg-primary-600 hover:bg-primary-700 text-white">Available/Swap</Button>
              </div>
            </div>
          </div>
        </div>
        {/* Previous Listings */}
        <div className="mt-10">
          <h3 className="text-md font-bold text-gray-200 mb-2">Previous Listings:</h3>
          {previousListings.length === 0 ? (
            <div className="text-gray-500 italic">No previous listings.</div>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-2">
              {previousListings.map((prev) => (
                <Link key={prev.id} href={`/item/${prev.id}`} className="block min-w-[140px] max-w-[140px]">
                  <div className="bg-[#232326] rounded-lg shadow p-3 border border-gray-700 flex flex-col items-center hover:shadow-xl transition-shadow">
                    <div className="w-20 h-20 bg-black rounded mb-2 flex items-center justify-center overflow-hidden">
                      {prev.images && prev.images.length > 0 ? (
                        <Image src={prev.images[0]} alt={prev.title} width={80} height={80} className="object-cover w-full h-full" />
                      ) : (
                        <span className="text-gray-500">No Image</span>
                      )}
                    </div>
                    <div className="text-gray-100 font-semibold text-center line-clamp-2 mb-1">{prev.title}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        {/* Owner Name at Bottom */}
        <div className="flex justify-center mt-8">
          <span className="bg-green-700 text-white px-4 py-2 rounded-lg font-bold text-lg shadow">{item.owner?.name || item.owner?.email}</span>
        </div>
      </main>
    </div>
  );
} 