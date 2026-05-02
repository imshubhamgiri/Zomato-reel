import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../../services/api';

export default function OrdersTab() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        const response = await orderAPI.getMyOrders();
        console.log('Fetched orders:', response);
        setOrders(response.data || response || []);
      } catch (err) {
        console.error('Failed to fetch orders', err);
        setError('Failed to load orders. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 text-slate-500 dark:text-slate-300">Loading your orders...</div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-300 py-20 flex flex-col items-center justify-center h-full">
        <svg className="w-20 h-20 text-blue-300 dark:text-blue-500/50 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">My Orders</h2>
        <p className="text-slate-500 dark:text-slate-300 max-w-sm mb-6">You haven't placed any orders yet. Discover some amazing food!</p>
        <button onClick={() => navigate('/')} className="px-6 py-2.5 bg-linear-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-white/25 transition-all">
          Browse Food
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Orders</h2>
        <p className="text-slate-500 dark:text-slate-300 mt-1">Your order history, newest first.</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <article key={order._id} className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow p-5">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Order #{order._id.slice(-8)}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                    order.status === 'confirmed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                    order.status === 'preparing' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                    order.status === 'out-for-delivery' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                    'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('-', ' ')}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">Rs {order.price}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{order.items?.length || 0} item(s)</p>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Items:</h4>
              <div className="space-y-2">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
                    <span>{item.nameSnapshot} x {item.quantity}</span>
                    <span>Rs {item.priceSnapshot * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {order.deliveryAddress && (
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Delivery Address:</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {order.deliveryAddress.address}, {order.deliveryAddress.city} {order.deliveryAddress.postalCode}
                </p>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
