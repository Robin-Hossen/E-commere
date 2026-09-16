import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { unwrapList } from '../api/endpoints';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance
      .get('orders/')
      .then((res) => setOrders(unwrapList(res.data)))
      .catch(() => setError('Failed to load your orders. Please try again.'));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-8">Order History</h1>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-2xl p-6 bg-white shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <span className="font-bold text-lg">Order #{order.id}</span>
                <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                order.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {order.status}
              </span>
            </div>

            <div className="space-y-2">
              {order.items?.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.quantity} x {item.product?.name}</span>
                  <span className="font-semibold">৳{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 flex justify-between font-bold">
              <span>Total Price</span>
              <span>৳{order.total_price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;