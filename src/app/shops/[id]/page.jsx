'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaStar, FaPhone, FaEnvelope, FaMapMarkerAlt, FaBoxOpen } from 'react-icons/fa';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ProductCard from '@/components/products/ProductCard';

export default function ShopDetails({ params }) {
  const [shop, setShop] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('featured');

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const response = await fetch(`/api/shops/${params.id}`);
        if (!response.ok) throw new Error('Shop not found');
        const data = await response.json();
        setShop(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching shop:', error);
        toast.error('Failed to load shop details');
      }
    };

    fetchShop();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Shop not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Shop Header */}
      <div className="relative h-64 rounded-xl overflow-hidden mb-8">
        <Image
          src={shop.coverImage || '/images/default-shop-cover.jpg'}
          alt={shop.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center">
          <div className="container mx-auto px-6">
            <div className="flex items-center space-x-6">
              <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white">
                <Image
                  src={shop.logo || '/images/default-shop-logo.jpg'}
                  alt={`${shop.name} logo`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-white">
                <h1 className="text-4xl font-bold">{shop.name}</h1>
                <div className="flex items-center mt-2 space-x-4">
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span>{shop.averageRating.toFixed(1)}</span>
                    <span className="ml-1 text-gray-300">({shop.ratings.length} reviews)</span>
                  </div>
                  <div className="flex items-center">
                    <FaBoxOpen className="mr-1" />
                    <span>{shop.products.length} products</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Info */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold">Shop Information</h2>
            <p className="text-gray-600">{shop.description}</p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-600">
                <FaMapMarkerAlt />
                <span>{shop.location}</span>
              </div>
              {shop.contact.phone && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <FaPhone />
                  <span>{shop.contact.phone}</span>
                </div>
              )}
              {shop.contact.email && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <FaEnvelope />
                  <span>{shop.contact.email}</span>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Shop Statistics</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-2xl font-bold text-green-600">{shop.totalSales}</p>
                  <p className="text-sm text-gray-600">Total Sales</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-2xl font-bold text-green-600">{shop.products.length}</p>
                  <p className="text-sm text-gray-600">Products</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {/* Tabs */}
          <div className="border-b mb-6">
            <nav className="flex space-x-8">
              <button
                className={`pb-4 px-1 ${
                  activeTab === 'featured'
                    ? 'border-b-2 border-green-500 text-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('featured')}
              >
                Featured Products
              </button>
              <button
                className={`pb-4 px-1 ${
                  activeTab === 'all'
                    ? 'border-b-2 border-green-500 text-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('all')}
              >
                All Products
              </button>
              <button
                className={`pb-4 px-1 ${
                  activeTab === 'reviews'
                    ? 'border-b-2 border-green-500 text-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'featured' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {shop.featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {activeTab === 'all' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {shop.products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {shop.ratings.length > 0 ? (
                shop.ratings.map((review, index) => (
                  <div key={index} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      <p className="font-medium">{review.user.name}</p>
                    </div>
                    <p className="text-gray-600">{review.review}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600">No reviews yet</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 