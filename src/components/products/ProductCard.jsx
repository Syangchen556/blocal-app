'use client';

import Image from 'next/image';
import { useState } from 'react';
import { FaShoppingCart, FaInfoCircle, FaLeaf, FaBoxOpen, FaTags } from 'react-icons/fa';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Link from 'next/link';

const ProductCard = ({ product }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent navigation when clicking the add to cart button
    try {
      setIsAnimating(true);
      
      // Get the cart icon element
      const cart = document.querySelector('[data-testid="cart-icon"]');
      if (!cart) {
        throw new Error('Cart icon not found');
      }
      
      // Get the current button position
      const button = document.getElementById(`add-to-cart-${product.id}`);
      if (!button) {
        throw new Error('Add to cart button not found');
      }
      
      // Create a floating cart item element
      const floatingItem = document.createElement('div');
      floatingItem.className = 'fixed z-50 bg-white rounded-full shadow-lg p-2';
      floatingItem.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      
      // Get element positions
      const buttonRect = button.getBoundingClientRect();
      const cartRect = cart.getBoundingClientRect();
      
      // Set initial position
      floatingItem.style.left = `${buttonRect.left}px`;
      floatingItem.style.top = `${buttonRect.top}px`;
      floatingItem.style.width = '40px';
      floatingItem.style.height = '40px';
      
      // Add the product image
      const img = document.createElement('img');
      img.src = product.imageUrl;
      img.className = 'w-full h-full object-cover rounded-full';
      floatingItem.appendChild(img);
      
      // Add to body
      document.body.appendChild(floatingItem);
      
      // Trigger animation
      setTimeout(() => {
        floatingItem.style.transform = 'scale(0.5)';
        floatingItem.style.left = `${cartRect.left}px`;
        floatingItem.style.top = `${cartRect.top}px`;
        floatingItem.style.opacity = '0';
      }, 50);
      
      // Add the product to cart in localStorage
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItemIndex = existingCart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex !== -1) {
        existingCart[existingItemIndex].quantity += 1;
      } else {
        existingCart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: 1
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(existingCart));
      
      // Clean up
      setTimeout(() => {
        if (document.body.contains(floatingItem)) {
          document.body.removeChild(floatingItem);
        }
        setIsAnimating(false);
        
        // Animate cart icon
        cart.classList.add('animate-bounce');
        setTimeout(() => cart.classList.remove('animate-bounce'), 500);
      }, 600);
    } catch (error) {
      console.error('Animation error:', error);
      setIsAnimating(false);
    }
  };

  const toggleDetails = (e) => {
    e.preventDefault();
    setShowDetails(!showDetails);
  };

  return (
    <Link href={`/product/${product.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-40 sm:h-48 md:h-56 w-full">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <LoadingSpinner size="md" />
            </div>
          )}
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            priority={false}
            quality={75}
            className={`
              object-cover
              transition-all duration-300 ease-in-out
              ${isLoading ? 'opacity-0' : 'opacity-100'}
            `}
            onLoad={() => setIsLoading(false)}
          />
          <button 
            className="absolute top-2 right-2 p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all"
            onClick={toggleDetails}
          >
            <FaInfoCircle className="text-green-600 text-xl" />
          </button>
        </div>
        <div className="p-3 sm:p-4">
          <h3 className="text-lg sm:text-xl font-bold text-center bg-green-600 text-white py-1 sm:py-2 rounded">
            {product.name}
          </h3>
          
          {/* Product Details Section */}
          <div className={`mt-2 space-y-2 ${showDetails ? 'block' : 'hidden'}`}>
            <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-1">
                <FaLeaf className="text-green-500" />
                <span>{product.category}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FaBoxOpen className="text-green-500" />
                <span>{product.stock} in stock</span>
              </div>
            </div>

            {product.specifications && product.specifications.length > 0 && (
              <div className="border-t pt-2">
                <h4 className="text-sm font-semibold flex items-center gap-1">
                  <FaTags className="text-green-500" />
                  Specifications
                </h4>
                <ul className="mt-1 space-y-1">
                  {product.specifications.slice(0, 2).map((spec, index) => (
                    <li key={index} className="text-xs text-gray-600">
                      {spec.key}: {spec.value}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.varieties && product.varieties.length > 0 && (
              <div className="border-t pt-2">
                <h4 className="text-sm font-semibold">Available Varieties</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {product.varieties.map((variety, index) => (
                    <span 
                      key={index}
                      className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                    >
                      {variety.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <p className="text-gray-600 mt-2 text-center text-base sm:text-lg">Nu. {product.price.toFixed(2)}</p>
          
          <button 
            id={`add-to-cart-${product.id}`}
            className={`
              w-full mt-3 sm:mt-4 bg-green-500 text-white py-2 px-4 rounded 
              hover:bg-green-600 transition-colors text-sm sm:text-base
              flex items-center justify-center space-x-2
              ${isAnimating ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onClick={handleAddToCart}
            disabled={isAnimating}
          >
            <FaShoppingCart className={`${isAnimating ? 'animate-spin' : ''}`} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard; 