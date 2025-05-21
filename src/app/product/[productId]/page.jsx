'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaShoppingCart, FaStar, FaStore, FaTruck, FaShieldAlt, FaUser, FaThumbsUp, FaChartLine, FaShoppingBasket } from 'react-icons/fa';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Toast from '@/components/ui/Toast';

export default function ProductDetails() {
  const { data: session } = useSession();
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariety, setSelectedVariety] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.productId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setProduct(data);
        if (data.varieties?.length > 0) {
          setSelectedVariety(data.varieties[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.productId]);

  const handleAddToCart = async () => {
    if (!session) {
      setToast({
        message: 'Please sign in to add items to cart',
        type: 'error'
      });
      return;
    }

    if (session.user.role === 'SELLER') {
      setToast({
        message: 'Sellers cannot add items to cart',
        type: 'error'
      });
      return;
    }

    setIsAddingToCart(true);
    
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: quantity,
          varietyId: selectedVariety?._id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      setToast({
        message: 'Added to cart successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      setToast({
        message: 'Failed to add to cart. Please try again.',
        type: 'error'
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!session) {
      setToast({
        message: 'Please sign in to submit a review',
        type: 'error'
      });
      return;
    }

    try {
      const response = await fetch(`/api/products/${product._id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReview),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      const updatedProduct = await response.json();
      setProduct(updatedProduct);
      setNewReview({ rating: 5, comment: '' });
      setShowReviewForm(false);
      setToast({
        message: 'Review submitted successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      setToast({
        message: 'Failed to submit review. Please try again.',
        type: 'error'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          Product not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative h-96 rounded-lg overflow-hidden">
                <Image
                  src={product.media.mainImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {product.media.gallery?.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.media.gallery.map((image, index) => (
                    <div key={index} className="relative h-24 rounded-lg overflow-hidden">
                      <Image
                        src={image}
                        alt={`${product.name} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.round(product.rating.average)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">
                    ({product.rating.count} reviews)
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-gray-600">{product.description.short}</p>
                <p className="text-gray-600">{product.description.full}</p>
              </div>

              {/* Pricing */}
              <div className="space-y-2">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-green-600">
                    Nu. {product.pricing.base.toFixed(2)}
                  </span>
                  {product.pricing.discounted && (
                    <>
                      <span className="ml-2 text-xl text-gray-500 line-through">
                        Nu. {product.pricing.discounted.toFixed(2)}
                      </span>
                      <span className="ml-2 text-sm text-red-500">
                        ({product.discountPercentage}% off)
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {product.inventory.stock} units in stock
                </p>
              </div>

              {/* Varieties */}
              {product.varieties?.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Available Varieties</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {product.varieties.map((variety) => (
                      <button
                        key={variety._id}
                        onClick={() => setSelectedVariety(variety)}
                        className={`p-2 border rounded-lg text-sm ${
                          selectedVariety?._id === variety._id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="font-medium">{variety.name}</div>
                        <div className="text-green-600">
                          Nu. {variety.price.toFixed(2)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="font-medium">Quantity:</label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1 rounded-md hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1 rounded-md hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className={`w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2 ${
                    isAddingToCart ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <FaShoppingCart />
                  <span>{isAddingToCart ? 'Adding...' : 'Add to Cart'}</span>
                </button>
              </div>

              {/* Shop Info */}
              <div className="border-t pt-6">
                <Link
                  href={`/shop/${product.shop._id}`}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <FaStore className="text-green-500" />
                  <span>{product.shop.name}</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Additional Sections */}
          <div className="border-t">
            <div className="p-8 space-y-8">
              {/* Specifications */}
              {product.specifications?.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Specifications</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.specifications.map((spec, index) => (
                      <div key={index} className="flex border-b pb-2">
                        <span className="font-medium w-1/3">{spec.name}:</span>
                        <span className="text-gray-600">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
                  {session && (
                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Write a Review
                    </button>
                  )}
                </div>

                {showReviewForm && (
                  <form onSubmit={handleSubmitReview} className="mb-8 p-4 bg-gray-50 rounded-lg">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
                      </label>
                      <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                            className="focus:outline-none"
                          >
                            <FaStar
                              className={`h-6 w-6 ${
                                star <= newReview.rating
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Review
                      </label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) =>
                          setNewReview(prev => ({ ...prev, comment: e.target.value }))
                        }
                        className="w-full p-2 border rounded-lg"
                        rows="4"
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Submit Review
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-6">
                  {product.reviews?.map((review) => (
                    <div key={review._id} className="border-b pb-6 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <FaUser className="text-gray-400" />
                          <span className="font-medium">{review.user.name}</span>
                          {review.verified && (
                            <span className="text-green-500 text-sm">Verified Purchase</span>
                          )}
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2">{review.comment}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                        <button
                          onClick={() => handleHelpful(review._id)}
                          className="ml-4 flex items-center space-x-1 hover:text-gray-900"
                        >
                          <FaThumbsUp />
                          <span>Helpful ({review.helpful || 0})</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
} 