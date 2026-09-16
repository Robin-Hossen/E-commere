import { useState, useContext } from 'react';
import { createOrder, initiatePayment } from '../api/endpoints';
import { CartContext } from '../context/CartContext';

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { cart, refreshCart } = useContext(CartContext);

  const items = cart?.items || [];
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.product?.discounted_price || item.product?.price || 0) * item.quantity,
    0
  );

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      // ১. Cart Data থেকে Backend Order তৈরি করা
      const orderRes = await createOrder();
      const orderId = orderRes.data.id;

      // Cart was converted into an order server-side; sync local cart state.
      await refreshCart();

      // ২. SSLCommerz Payment Gateway লিংক রিকোয়েস্ট করা
      const paymentRes = await initiatePayment(orderId);
      if (paymentRes.data?.GatewayPageURL) {
        // ৩. SSLCommerz sandbox/live পেজে রিডাইরেক্ট
        window.location.href = paymentRes.data.GatewayPageURL;
        return;
      }
      setError('Payment gateway did not return a payment page URL.');
    } catch (err) {
      const data = err.response?.data;
      const msg = typeof data === 'object' && data !== null
        ? Object.values(data).flat().join(' ')
        : data;
      setError(msg || 'Order placement failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-12 p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Order Summary</h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between font-semibold text-gray-700">
          <span>Total Amount</span>
          <span>৳{totalPrice}</span>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-black hover:bg-gray-800 text-white py-4 rounded-xl font-semibold text-lg transition-all"
      >
        {loading ? 'Processing...' : 'Pay with SSLCommerz'}
      </button>
    </div>
  );
};

export default Checkout;