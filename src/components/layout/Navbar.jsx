'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaStore, FaBox, FaClipboardList, FaHeart, FaBlog, FaUsers, FaShippingFast, FaChartBar, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (session?.user?.role === 'BUYER') {
      fetchCartCount();
    }
  }, [session]);

  const fetchCartCount = async () => {
    try {
      const response = await fetch('/api/cart/count');
      if (response.ok) {
        const data = await response.json();
        setCartCount(data.count);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getNavItems = () => {
    const role = session?.user?.role;

    switch (role) {
      case 'ADMIN':
        return [
          { href: '/dashboard/admin/shops', label: 'Shop List', icon: FaStore },
          { href: '/dashboard/admin/users', label: 'Buyers', icon: FaUsers },
          { href: '/dashboard/admin/orders', label: 'Order Tracking', icon: FaShippingFast },
          { href: '/dashboard/admin/stats', label: 'Statistics', icon: FaChartBar },
        ];
      case 'SELLER':
        return [
          { href: '/', label: 'Home', icon: FaStore },
          { href: '/help', label: 'Help', icon: FaClipboardList },
          { href: '/blog', label: 'Blog', icon: FaBlog },
          { href: '/dashboard/seller/profile', label: 'Shop Profile', icon: FaStore },
          { href: '/dashboard/seller/products', label: 'Products', icon: FaBox },
        ];
      case 'BUYER':
        return [
          { href: '/', label: 'Home', icon: FaStore },
          { href: '/help', label: 'Help', icon: FaClipboardList },
          { href: '/blog', label: 'Blog', icon: FaBlog },
          { href: '/dashboard/buyer/wishlist', label: 'Wishlist', icon: FaHeart },
          { href: '/dashboard/buyer/profile', label: 'Profile', icon: FaUser },
        ];
      default:
        return [
          { href: '/', label: 'Home', icon: FaStore },
          { href: '/help', label: 'Help', icon: FaClipboardList },
          { href: '/blog', label: 'Blog', icon: FaBlog },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="bg-green-500">
      {/* Top Navigation Bar */}
      <nav className="bg-green-600 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-white text-2xl font-bold">
            Vegetable Store
          </Link>

          <div className="hidden md:flex flex-1 mx-8">
            <div className="relative flex-1 max-w-2xl">
              <input
                type="search"
                placeholder="Search products..."
                className="w-full px-4 py-2 rounded-lg focus:outline-none"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                🔍
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {session?.user?.role === 'BUYER' && (
              <Link href="/cart" className="text-white hover:text-gray-200 relative group">
                <div className="relative">
                  <FaShoppingCart 
                    className="text-2xl transition-transform duration-200 ease-in-out transform group-hover:scale-110" 
                    data-testid="cart-icon"
                  />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
              </Link>
            )}
            
            {session ? (
              <Link href="/api/auth/signout" className="text-white hover:text-gray-200 flex items-center space-x-2">
                <FaSignOutAlt className="text-lg" />
                <span>Logout</span>
              </Link>
            ) : (
              <Link href="/api/auth/signin" className="text-white hover:text-gray-200">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Secondary Navigation Bar */}
      <div className="bg-green-500 shadow-md">
        <div className="container mx-auto">
          {/* Mobile Menu Button */}
          <div className="md:hidden p-4">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          {/* Desktop Navigation Items */}
          <div className="hidden md:flex space-x-6 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white hover:text-gray-200 flex items-center space-x-1"
              >
                <item.icon className="text-lg" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Navigation Items */}
          {isMenuOpen && (
            <div className="md:hidden bg-green-500">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-white hover:text-gray-200 flex items-center space-x-2 p-4 border-b border-green-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="text-lg" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search - Only visible on mobile */}
      <div className="md:hidden p-4 bg-green-500">
        <div className="relative">
          <input
            type="search"
            placeholder="Search products..."
            className="w-full px-4 py-2 rounded-lg focus:outline-none"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
            🔍
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar; 