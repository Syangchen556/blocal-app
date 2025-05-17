'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaShoppingCart, FaStar, FaStore, FaTruck, FaShieldAlt, FaUser, FaThumbsUp, FaChartLine, FaShoppingBasket } from 'react-icons/fa';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

// Sample product data - In a real app, this would come from your database
const productData = {
  1: {
    id: 1,
    name: 'APPLE',
    price: 150,
    imageUrl: '/images/products/fruits/apple.jpg',
    description: 'Fresh and crispy apples from Bhutanese orchards.',
    totalSold: 2500,
    analytics: {
      monthlySales: [150, 200, 180, 250, 300, 280, 320, 310, 350, 330, 400, 420],
      frequentlyBoughtTogether: [
        { id: 2, name: 'BANANA', price: 80, imageUrl: '/images/products/fruits/banana.jpg', percentage: 65 },
        { id: 3, name: 'ORANGE', price: 120, imageUrl: '/images/products/fruits/orange.jpg', percentage: 45 },
        { id: 4, name: 'GRAPES', price: 200, imageUrl: '/images/products/fruits/grapes.jpg', percentage: 30 }
      ],
      customerPreferences: {
        'Variety Preference': {
          'Red Apple': '45%',
          'Green Apple': '30%',
          'Royal Gala': '25%'
        },
        'Purchase Size': {
          '1kg': '40%',
          '2kg': '35%',
          '5kg': '25%'
        }
      }
    },
    varieties: [
      { id: 'red', name: 'Red Apple', price: 150, color: 'red' },
      { id: 'green', name: 'Green Apple', price: 160, color: 'green' },
      { id: 'royal', name: 'Royal Gala', price: 180, color: 'red-yellow' }
    ],
    shop: {
      name: 'Skye Fresh Fruits',
      rating: 4.8,
      totalSales: 1500,
      location: 'Thimphu, Bhutan',
      joinedDate: '2023',
      description: 'Premium fruit supplier in Bhutan'
    },
    specifications: {
      'Origin': 'Bhutan',
      'Storage': 'Keep refrigerated',
      'Shelf Life': '1-2 weeks when refrigerated',
      'Packaging': 'Eco-friendly boxes',
      'Weight Options': '1kg, 2kg, 5kg'
    },
    features: [
      'Naturally grown',
      'No artificial ripening',
      'Pesticide-free',
      'Hand-picked at peak ripeness'
    ],
    reviews: [
      {
        id: 1,
        user: 'Karma Dorji',
        rating: 5,
        date: '2024-03-15',
        comment: 'Very fresh and sweet apples. The packaging was excellent!',
        helpful: 12,
        verified: true
      },
      {
        id: 2,
        user: 'Tshering Yangzom',
        rating: 4,
        date: '2024-03-14',
        comment: 'Good quality apples, but some were slightly bruised.',
        helpful: 8,
        verified: true
      }
    ]
  },
  2: {
    id: 2,
    name: 'BANANA',
    price: 80,
    totalSold: 1800,
    analytics: {
      monthlySales: [120, 140, 160, 180, 200, 190, 210, 230, 250, 240, 260, 280],
      frequentlyBoughtTogether: [
        { id: 1, name: 'APPLE', price: 150, imageUrl: '/images/products/fruits/apple.jpg', percentage: 65 },
        { id: 5, name: 'MANGO', price: 160, imageUrl: '/images/products/fruits/mango.jpg', percentage: 40 },
        { id: 6, name: 'PAPAYA', price: 90, imageUrl: '/images/products/fruits/papaya.jpg', percentage: 25 }
      ],
      customerPreferences: {
        'Variety Preference': {
          'Regular': '60%',
          'Organic': '40%'
        },
        'Purchase Size': {
          '1kg': '50%',
          '2kg': '50%'
        }
      }
    },
    imageUrl: '/images/products/fruits/banana.jpg',
    description: 'Sweet and ripe bananas from local farms.',
    varieties: [
      { id: 'regular', name: 'Regular Banana', price: 80, type: 'regular' },
      { id: 'organic', name: 'Organic Banana', price: 100, type: 'organic' }
    ],
    shop: {
      name: 'Skye Fresh Fruits',
      rating: 4.8,
      totalSales: 1500,
      location: 'Thimphu, Bhutan',
      joinedDate: '2023',
      description: 'Premium fruit supplier in Bhutan'
    },
    specifications: {
      'Origin': 'Bhutan',
      'Storage': 'Room temperature',
      'Shelf Life': '4-5 days',
      'Packaging': 'Eco-friendly boxes',
      'Weight Options': '1kg, 2kg'
    },
    features: [
      'Naturally ripened',
      'Rich in potassium',
      'Perfect for smoothies',
      'Locally sourced'
    ],
    reviews: [
      {
        id: 1,
        user: 'Pema Wangchuk',
        rating: 5,
        date: '2024-03-16',
        comment: 'Perfect ripeness and great taste!',
        helpful: 15,
        verified: true
      }
    ]
  }
};

export default function ProductDetails() {
  const { data: session } = useSession();
  const params = useParams();
  const [selectedVariety, setSelectedVariety] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });
  const [reviews, setReviews] = useState([]);

  const product = productData[params.id];

  useEffect(() => {
    if (product?.varieties?.length > 0) {
      setSelectedVariety(product.varieties[0]);
    }
    if (product?.reviews) {
      setReviews(product.reviews);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          Product not found
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!session) {
      alert('Please sign in to add items to cart');
      return;
    }

    if (session.user.role === 'SELLER') {
      alert('Sellers cannot add items to cart');
      return;
    }

    setIsAddingToCart(true);
    
    try {
      // Get current cart
      const cartResponse = await fetch('/api/cart');
      const currentCart = await cartResponse.json();

      const cartItem = {
        product: product.id,
        quantity: quantity,
        variety: selectedVariety ? {
          id: selectedVariety.id,
          name: selectedVariety.name,
          price: selectedVariety.price
        } : null
      };

      // Update cart items
      const existingItemIndex = currentCart.items.findIndex(
        item => item.product === cartItem.product && 
        (!item.variety || !cartItem.variety || item.variety.id === cartItem.variety.id)
      );

      let updatedItems;
      if (existingItemIndex !== -1) {
        updatedItems = [...currentCart.items];
        updatedItems[existingItemIndex].quantity += quantity;
      } else {
        updatedItems = [...currentCart.items, cartItem];
      }

      // Update cart in database
      const updateResponse = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: updatedItems }),
      });

      if (!updateResponse.ok) throw new Error('Failed to update cart');

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

  const handleSubmitReview = (e) => {
    e.preventDefault();
    const newReviewObj = {
      id: reviews.length + 1,
      user: session?.user?.name || 'Anonymous',
      rating: newReview.rating,
      date: new Date().toISOString().split('T')[0],
      comment: newReview.comment,
      helpful: 0,
      verified: true
    };

    setReviews([newReviewObj, ...reviews]);
    setNewReview({ rating: 5, comment: '' });
    setShowReviewForm(false);
  };

  const handleHelpful = (reviewId) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: review.helpful + 1 }
        : review
    ));
  };

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="relative h-96 md:h-full min-h-[400px] rounded-lg overflow-hidden">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-gray-600">{product.description}</p>

              {/* Price */}
              <div className="text-2xl font-bold text-gray-900">
                Nu. {selectedVariety ? selectedVariety.price : product.price}
              </div>

              {/* Varieties */}
              {product.varieties && product.varieties.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Available Varieties</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {product.varieties.map((variety) => (
                      <button
                        key={variety.id}
                        onClick={() => setSelectedVariety(variety)}
                        className={`p-3 rounded-lg border ${
                          selectedVariety?.id === variety.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-green-500'
                        }`}
                      >
                        <div className="font-medium">{variety.name}</div>
                        <div className="text-sm text-gray-500">Nu. {variety.price}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border rounded-md"
                  >
                    -
                  </button>
                  <span className="w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 border rounded-md"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
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

              {/* Delivery Info */}
              <div className="border-t pt-6 mt-6">
                <div className="flex items-center space-x-4">
                  <FaTruck className="text-green-500" />
                  <div>
                    <h4 className="font-medium">Free Delivery</h4>
                    <p className="text-sm text-gray-500">Within Thimphu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Sections */}
          <div className="border-t">
            <div className="p-8 space-y-8">
              {/* Specifications */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex border-b pb-2">
                      <span className="font-medium w-1/3">{key}:</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <FaShieldAlt className="text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Shop Info */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Shop</h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center space-x-4 mb-4">
                    <FaStore className="text-3xl text-green-500" />
                    <div>
                      <Link 
                        href={`/shop/${product.shop.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-xl font-bold hover:text-green-600 transition-colors"
                      >
                        {product.shop.name}
                      </Link>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <FaStar className="text-yellow-400" />
                          <span className="ml-1">{product.shop.rating}</span>
                        </div>
                        <span>•</span>
                        <span>{product.shop.totalSales}+ sales</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">{product.shop.description}</p>
                  <div className="mt-4 text-sm text-gray-500">
                    <div>Location: {product.shop.location}</div>
                    <div>Member since: {product.shop.joinedDate}</div>
                  </div>
                </div>
              </div>

              {/* Product Analytics */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Analytics</h2>
                <div className="space-y-6">
                  {/* Sales Overview */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center space-x-2 mb-4">
                      <FaChartLine className="text-green-500" />
                      <h3 className="text-xl font-bold">Sales Overview</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg">
                        <div className="text-gray-600">Total Units Sold</div>
                        <div className="text-2xl font-bold">{product.totalSold}</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <div className="text-gray-600">Monthly Average</div>
                        <div className="text-2xl font-bold">
                          {Math.round(product.analytics.monthlySales.reduce((a, b) => a + b, 0) / 12)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Frequently Bought Together */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center space-x-2 mb-4">
                      <FaShoppingBasket className="text-green-500" />
                      <h3 className="text-xl font-bold">Frequently Bought Together</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {product.analytics.frequentlyBoughtTogether.map((item) => (
                        <Link 
                          key={item.id}
                          href={`/product/${item.id}`}
                          className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="relative h-32 mb-2">
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-500">Nu. {item.price}</div>
                            <div className="text-sm text-green-600">{item.percentage}% buy together</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Customer Preferences */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center space-x-2 mb-4">
                      <FaUser className="text-green-500" />
                      <h3 className="text-xl font-bold">Customer Preferences</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(product.analytics.customerPreferences).map(([category, data]) => (
                        <div key={category} className="bg-white p-4 rounded-lg">
                          <h4 className="font-medium mb-3">{category}</h4>
                          <div className="space-y-2">
                            {Object.entries(data).map(([label, value]) => (
                              <div key={label} className="flex justify-between items-center">
                                <span className="text-gray-600">{label}</span>
                                <span className="font-medium">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Customer Reviews
                  <span className="ml-2 text-lg text-gray-600">
                    ({reviews.length})
                  </span>
                </h2>
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Write a Review
                </button>
              </div>

              {/* Review Summary */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`w-5 h-5 ${
                          star <= averageRating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-xl font-bold">
                    {averageRating.toFixed(1)} out of 5
                  </span>
                </div>
                <p className="text-gray-600">
                  Based on {reviews.length} customer reviews
                </p>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <div className="mb-8 bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Write Your Review</h3>
                  <form onSubmit={handleSubmitReview}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
                      </label>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReview({ ...newReview, rating: star })}
                            className="focus:outline-none"
                          >
                            <FaStar
                              className={`w-8 h-8 ${
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
                        Your Review
                      </label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Share your experience with this product..."
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                      >
                        Submit Review
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6">
                    <div className="flex items-center mb-2">
                      <FaUser className="text-gray-400 mr-2" />
                      <span className="font-medium">{review.user}</span>
                      {review.verified && (
                        <span className="ml-2 text-xs text-green-600 border border-green-600 rounded px-2">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="flex items-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-500">
                        {review.date}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{review.comment}</p>
                    <button
                      onClick={() => handleHelpful(review.id)}
                      className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                    >
                      <FaThumbsUp className="mr-1" />
                      <span>Helpful ({review.helpful})</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 