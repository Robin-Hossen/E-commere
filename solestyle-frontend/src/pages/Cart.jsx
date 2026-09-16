import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import axiosInstance from '../api/axiosInstance';
import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, refreshCart } = useContext(CartContext);

  const updateQuantity = async (itemId, newQty) => {
    try {
      if (newQty < 1) {
        // Decrementing below 1 removes the item.
        await removeItem(itemId);
        return;
      }
      await axiosInstance.patch(`cart-items/${itemId}/`, { quantity: newQty });
      refreshCart();
    } catch (err) {
      const msg = err.response?.data?.quantity;
      alert(Array.isArray(msg) ? msg.join(' ') : msg || 'Error updating quantity');
    }
  };

  const removeItem = async (itemId) => {
    try {
      await axiosInstance.delete(`cart-items/${itemId}/`);
      refreshCart();
    } catch {
      alert('Error removing item');
    }
  };

  const items = cart?.items || [];
  const total = items.reduce(
    (sum, item) => sum + Number(item.product?.discounted_price || item.product?.price || 0) * item.quantity,
    0
  );
  const formattedTotal = total.toFixed(2);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <Link to="/" className="inline-block bg-black text-white px-6 py-3 rounded-lg font-bold">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 border rounded-xl bg-white shadow-sm">
              <img
                src={item.product?.images?.[0]?.image || 'https://via.placeholder.com/100'}
                alt={item.product?.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{item.product?.name}</h3>
                <p className="text-sm font-semibold text-gray-500">
                  ৳{item.product?.discounted_price || item.product?.price}
                </p>
              </div>

              {/* Quantity Changer */}
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="px-3 py-1 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-3 font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="px-3 py-1 hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700 p-2"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* Checkout Summary */}
        <div className="p-6 border rounded-2xl bg-gray-50 h-fit space-y-4">
          <h2 className="text-xl font-bold border-b pb-3">Order Summary</h2>
          <div className="flex justify-between font-semibold">
            <span>Subtotal</span>
            <span>৳{formattedTotal}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="border-t pt-3 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>৳{formattedTotal}</span>
          </div>

          <Link
            to="/checkout"
            className="block text-center w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition"
          >
            PROCEED TO CHECKOUT
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;