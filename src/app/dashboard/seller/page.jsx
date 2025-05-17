'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaStore, FaBox, FaChartLine, FaCog, FaPlus, FaChartBar } from 'react-icons/fa';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function SellerDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (session.user.role !== 'SELLER') {
      router.push('/dashboard');
      return;
    }

    fetchShopData();
    fetchSalesData();
    fetchTopProducts();
  }, [session, router]);

  const fetchShopData = async () => {
    try {
      const response = await fetch('/api/shop/my-shop');
      if (response.ok) {
        const data = await response.json();
        setShop(data);
      } else if (response.status === 404) {
        router.push('/dashboard/seller/create-shop');
      }
    } catch (error) {
      console.error('Error fetching shop data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSalesData = async () => {
    // TODO: Implement actual API endpoint
    // For now, using dummy data
    setSalesData([
      { date: '2024-01', sales: 4000 },
      { date: '2024-02', sales: 3000 },
      { date: '2024-03', sales: 5000 },
      // Add more months as needed
    ]);
  };

  const fetchTopProducts = async () => {
    // TODO: Implement actual API endpoint
    // For now, using dummy data
    setTopProducts([
      { name: 'Organic Apples', sold: 150, revenue: 3000 },
      { name: 'Fresh Carrots', sold: 120, revenue: 2400 },
      { name: 'Bananas', sold: 100, revenue: 2000 },
    ]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!shop) {
    return null; // Will redirect to create shop page
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Shop Profile Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="relative h-48">
            <Image
              src={shop.coverImage || '/images/default-shop-cover.png'}
              alt="Shop Cover"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative px-6 pb-6">
            <div className="flex items-center -mt-12">
              <div className="relative h-24 w-24 rounded-full border-4 border-white overflow-hidden">
                <Image
                  src={shop.logo || '/images/default-shop.png'}
                  alt={shop.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="ml-4 mt-12">
                <h1 className="text-2xl font-bold text-gray-900">{shop.name}</h1>
                <p className="text-gray-600">{shop.description}</p>
                <div className="mt-2 flex space-x-4">
                  <span className="text-sm text-gray-500">
                    <FaStore className="inline mr-1" /> {shop.location}
                  </span>
                  <span className="text-sm text-gray-500">
                    Status: <span className="capitalize">{shop.status}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Analysis */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Sales Analysis</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#4F46E5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b text-left">Product</th>
                  <th className="px-6 py-3 border-b text-right">Units Sold</th>
                  <th className="px-6 py-3 border-b text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 border-b">{product.name}</td>
                    <td className="px-6 py-4 border-b text-right">{product.sold}</td>
                    <td className="px-6 py-4 border-b text-right">Nu. {product.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/dashboard/seller/products" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <FaBox className="text-4xl text-green-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Manage Products</h3>
              <p className="text-gray-600">Add, edit, and manage your products</p>
            </div>
          </Link>
          <Link href="/dashboard/seller/add-product" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <FaPlus className="text-4xl text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Add New Product</h3>
              <p className="text-gray-600">List a new product for sale</p>
            </div>
          </Link>
          <Link href="/dashboard/seller/sales" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <FaChartBar className="text-4xl text-purple-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Sales Analytics</h3>
              <p className="text-gray-600">View detailed sales reports</p>
            </div>
          </Link>
          <Link href="/dashboard/seller/settings" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <FaCog className="text-4xl text-gray-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Settings</h3>
              <p className="text-gray-600">Manage your shop settings</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
} 