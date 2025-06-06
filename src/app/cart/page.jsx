'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
<<<<<<< HEAD
import Button from '@/components/ui/Button';
import { useCart } from '@/contexts/CartContext';
=======
import ConfirmDialog from '@/components/ui/ConfirmDialog';
>>>>>>> ce08c47481366906128db17c6bd3eaf53dc5d6a3

export default function Cart() {
  const { data: session } = useSession();
  const router = useRouter();
<<<<<<< HEAD
  const { 
    cart, 
    loading, 
    error, 
    updateQuantity, 
    removeItem, 
    getCartTotal 
  } = useCart();
=======
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
>>>>>>> ce08c47481366906128db17c6bd3eaf53dc5d6a3

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }
<<<<<<< HEAD

    if (session.user.role === 'SELLER') {
      router.push('/dashboard/seller');
      return;
    }
  }, [session, router]);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = async (productId) => {
    await removeItem(productId);
  };

  if (loading) {
=======
    fetchCart();
  }, [session, router]);

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart');
      if (!response.ok) throw new Error('Failed to fetch cart');
      const data = await response.json();
      setCart(data.items);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = async (productId, change) => {
    try {
      const response = await fetch('/api/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity: change === 'increment' ? 1 : -1,
        }),
      });

      if (!response.ok) throw new Error('Failed to update quantity');
      fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (productId) => {
    setConfirmAction(() => async () => {
      try {
        const response = await fetch(`/api/cart/remove/${productId}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to remove item');
        toast.success('Item removed from cart');
        fetchCart();
      } catch (error) {
        console.error('Error removing item:', error);
        toast.error('Failed to remove item');
      }
    });
    setShowConfirm(true);
  };

  const handleClearCart = () => {
    setConfirmAction(() => async () => {
      try {
        const response = await fetch('/api/cart/clear', {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to clear cart');
        toast.success('Cart cleared');
        fetchCart();
      } catch (error) {
        console.error('Error clearing cart:', error);
        toast.error('Failed to clear cart');
      }
    });
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    if (confirmAction) {
      await confirmAction();
      setShowConfirm(false);
      setConfirmAction(null);
    }
  };

  if (isLoading) {
>>>>>>> ce08c47481366906128db17c6bd3eaf53dc5d6a3
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

<<<<<<< HEAD
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }
=======
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
>>>>>>> ce08c47481366906128db17c6bd3eaf53dc5d6a3

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        {cart.length > 0 && (
          <button
            onClick={handleClearCart}
            className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700"
          >
            <FaTrash />
            <span>Clear Cart</span>
          </button>
        )}
      </div>

<<<<<<< HEAD
        {!cart?.items?.length ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <Button
              variant="primary"
              onClick={() => router.push('/')}
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {cart.items.map((item) => (
                    <div key={item.product._id} className="p-6 flex items-center">
                      <div className="relative h-24 w-24 flex-shrink-0">
                        <Image
                          src={item.product.media.mainImage}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="ml-6 flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {item.product.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {item.product.shop.name}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center">
                            <button
                              onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                              className="p-1 rounded-full hover:bg-gray-100"
                            >
                              <FaMinus className="h-4 w-4 text-gray-500" />
                            </button>
                            <span className="mx-2 text-gray-700">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                              className="p-1 rounded-full hover:bg-gray-100"
                            >
                              <FaPlus className="h-4 w-4 text-gray-500" />
                            </button>
                          </div>
                          <div className="flex items-center">
                            <p className="text-lg font-medium text-gray-900">
                              Nu. {(item.product.pricing.base * item.quantity).toFixed(2)}
                            </p>
                            <button
                              onClick={() => handleRemoveItem(item.product._id)}
                              className="ml-4 text-red-500 hover:text-red-700"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">Nu. {getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">Free</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-medium text-gray-900">Total</span>
                      <span className="text-lg font-medium text-gray-900">
                        Nu. {getCartTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => router.push('/checkout')}
                  >
                    Proceed to Checkout
                  </Button>
=======
      {cart.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">Your cart is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {cart.map((item) => (
                <div
                  key={item.product._id}
                  className="flex items-center p-4 border-b last:border-b-0"
                >
                  <div className="relative h-24 w-24 flex-shrink-0">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="ml-4 flex-grow">
                    <h3 className="text-lg font-medium text-gray-900">
                      {item.product.name}
                    </h3>
                    <p className="text-gray-600">Nu. {item.product.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.product._id, 'decrement')}
                        disabled={item.quantity <= 1}
                        className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
                      >
                        <FaMinus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.product._id, 'increment')}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <FaPlus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.product._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Nu. {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
>>>>>>> ce08c47481366906128db17c6bd3eaf53dc5d6a3
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>Nu. {total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        title="Confirm Action"
        message="Are you sure you want to proceed with this action? This cannot be undone."
      />
    </div>
  );
} 