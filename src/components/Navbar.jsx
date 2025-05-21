'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { FaHome, FaQuestionCircle, FaBlog, FaShoppingCart, FaHeart, FaSignOutAlt, FaStore, FaUser, FaChartLine, FaHistory, FaCog, FaBox, FaClipboardList, FaTruck, FaChartBar } from 'react-icons/fa';

export default function Navbar() {
  const { data: session } = useSession();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (session && session.user.role === 'BUYER') {
      fetchCartCount();
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [session]);

  const fetchCartCount = async () => {
    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        setCartItemCount(data.items?.length || 0);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const handleLinkClick = () => {
    setIsProfileOpen(false);
  };

  if (!session) {
    return null;
  }

  const getNavItems = () => {
    const role = session.user.role;

    switch (role) {
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
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="BLocal" className="h-8 w-auto" />
              <span className="ml-2 text-xl font-semibold text-gray-900">BLocal</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <item.icon className="h-5 w-5 mr-1" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {!session.user.role === 'SELLER' && (
              <>
                <Link href="/cart" className="nav-link relative">
                  <FaShoppingCart className="h-5 w-5" />
                  <span>Cart</span>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>

                <Link href="/wishlist" className="nav-link">
                  <FaHeart className="h-5 w-5" />
                  <span>Wishlist</span>
                </Link>
              </>
            )}

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <Image
                  src={session.user.image || '/images/default-avatar.png'}
                  alt={session.user.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="hidden md:block">{session.user.name}</span>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  {session.user.role === 'SELLER' ? (
                    <>
                      <Link href="/dashboard/seller" className="dropdown-item" onClick={handleLinkClick}>
                        <FaStore className="w-4 h-4" />
                        <span>Shop Dashboard</span>
                      </Link>
                      <Link href="/dashboard/seller/products" className="dropdown-item" onClick={handleLinkClick}>
                        <FaBox className="w-4 h-4" />
                        <span>Products</span>
                      </Link>
                      <Link href="/dashboard/seller/sales" className="dropdown-item" onClick={handleLinkClick}>
                        <FaChartLine className="w-4 h-4" />
                        <span>Sales Analytics</span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/profile" className="dropdown-item" onClick={handleLinkClick}>
                        <FaUser className="w-4 h-4" />
                        <span>My Profile</span>
                      </Link>
                      <Link href="/profile?tab=orders" className="dropdown-item" onClick={handleLinkClick}>
                        <FaClipboardList className="w-4 h-4" />
                        <span>Purchase History</span>
                      </Link>
                      <Link href="/profile?tab=tracking" className="dropdown-item" onClick={handleLinkClick}>
                        <FaTruck className="w-4 h-4" />
                        <span>Order Tracking</span>
                      </Link>
                      <Link href="/profile?tab=stats" className="dropdown-item" onClick={handleLinkClick}>
                        <FaChartBar className="w-4 h-4" />
                        <span>Statistics</span>
                      </Link>
                    </>
                  )}

                  <Link href="/settings" className="dropdown-item" onClick={handleLinkClick}>
                    <FaCog className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>

                  <button 
                    onClick={() => {
                      handleLogout();
                      handleLinkClick();
                    }} 
                    className="dropdown-item text-red-600 hover:text-red-900"
                  >
                    <FaSignOutAlt className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          color: #4a5568;
          font-size: 0.875rem;
          transition: color 0.2s;
        }
        .nav-link:hover {
          color: #2d3748;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          color: #4a5568;
          transition: background-color 0.2s;
        }
        .dropdown-item:hover {
          background-color: #f7fafc;
        }
      `}</style>
    </nav>
  );
} 