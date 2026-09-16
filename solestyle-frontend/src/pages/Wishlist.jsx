import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';

const Wishlist = () => {
  const { addToCart } = useContext(CartContext);
  const { wishlist, refreshWishlist } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);

  const wishlistProducts = wishlist?.products || [];

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <Heart size={48} className="mx-auto text-gray-300 mb-4" />
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-3">My Wishlist</h1>
        <p className="text-gray-500 mb-6">Please log in to see your wishlist.</p>
        <Link
          to="/login"
          className="inline-block rounded-full bg-primary-600 px-8 py-3 font-semibold text-white shadow-lg shadow-primary-600/30 transition hover:bg-primary-700"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900">My Wishlist</h1>
        <button
          onClick={refreshWishlist}
          className="text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          Refresh
        </button>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-20">
          <Heart size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-6">Your wishlist is empty.</p>
          <Link
            to="/shop"
            className="inline-block rounded-full bg-primary-600 px-8 py-3 font-semibold text-white shadow-lg shadow-primary-600/30 transition hover:bg-primary-700"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={(id) => addToCart(id, 1)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;