'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaBox, FaHistory, FaChartPie } from 'react-icons/fa';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function BuyerDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [frequentProducts, setFrequentProducts] = useState([]);

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (session.user.role !== 'BUYER') {
      router.push('/dashboard');
      return;
    }

    fetchOrderHistory();
    fetchFrequentProducts();
  }, [session, router]);

  const fetchOrderHistory = async () => {
    // TODO: Implement actual API endpoint
    // For now, using dummy data
    setOrders([
      {
        id: 'ORD001',
        date: '2024-03-15',
        total: 1500,
        status: 'Delivered',
        items: [
          { name: 'Organic Apples', quantity: 2, price: 500 },
          { name: 'Fresh Carrots', quantity: 1, price: 1000 },
        ],
      },
      // Add more orders as needed
    ]);
    setLoading(false);
  };

  const fetchFrequentProducts = async () => {
    // TODO: Implement actual API endpoint
    // For now, using dummy data
    setFrequentProducts([
      { name: 'Organic Apples', purchases: 10, lastPurchased: '2024-03-15' },
      { name: 'Fresh Carrots', purchases: 8, lastPurchased: '2024-03-10' },
      { name: 'Bananas', purchases: 6, lastPurchased: '2024-03-05' },
    ]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center">
            <div className="relative h-20 w-20 rounded-full overflow-hidden">
              <Image
                src={session.user.image || '/images/default-avatar.png'}
                alt={session.user.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">{session.user.name}</h1>
              <p className="text-gray-600">{session.user.email}</p>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <FaHistory className="text-gray-400 text-xl" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b text-left">Order ID</th>
                  <th className="px-6 py-3 border-b text-left">Date</th>
                  <th className="px-6 py-3 border-b text-left">Items</th>
                  <th className="px-6 py-3 border-b text-right">Total</th>
                  <th className="px-6 py-3 border-b text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 border-b">{order.id}</td>
                    <td className="px-6 py-4 border-b">{order.date}</td>
                    <td className="px-6 py-4 border-b">
                      {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                    </td>
                    <td className="px-6 py-4 border-b text-right">Nu. {order.total}</td>
                    <td className="px-6 py-4 border-b">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Frequently Bought Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Frequently Bought Products</h2>
            <FaChartPie className="text-gray-400 text-xl" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b text-left">Product</th>
                  <th className="px-6 py-3 border-b text-center">Times Purchased</th>
                  <th className="px-6 py-3 border-b text-right">Last Purchased</th>
                </tr>
              </thead>
              <tbody>
                {frequentProducts.map((product, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 border-b">{product.name}</td>
                    <td className="px-6 py-4 border-b text-center">{product.purchases}</td>
                    <td className="px-6 py-4 border-b text-right">{product.lastPurchased}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 