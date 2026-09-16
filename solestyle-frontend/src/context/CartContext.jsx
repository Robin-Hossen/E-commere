/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from 'react';
import { fetchCart, addToCart as apiAddToCart, unwrapList } from '../api/endpoints';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const { user } = useContext(AuthContext);

  const loadCart = async () => {
    if (!user) return;
    try {
      const response = await fetchCart();
      const carts = unwrapList(response.data);
      if (carts.length > 0) {
        const currentCart = carts[0];
        setCart(currentCart);

        // মোট আইটেম সংখ্যা বের করা
        const count = currentCart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        setCartCount(count);
      } else {
        setCart(null);
        setCartCount(0);
      }
    } catch (error) {
      console.error("Cart loading failed:", error);
    }
  };

  useEffect(() => {
    // Cart loading synchronizes authenticated server state when the user changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (user) loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      alert("Please login first to add items to cart!");
      return;
    }
    try {
      await apiAddToCart(productId, quantity);
      await loadCart(); // রিফ্রেশ কার্ট ডাটা
    } catch (error) {
      alert(error.response?.data?.quantity || "Failed to add to cart");
    }
  };

  // When logged out, present the cart as empty without touching state in an effect.
  const activeCart = user ? cart : null;
  const activeCartCount = user ? cartCount : 0;

  return (
    <CartContext.Provider value={{ cart: activeCart, cartCount: activeCartCount, addToCart, refreshCart: loadCart }}>
      {children}
    </CartContext.Provider>
  );
};