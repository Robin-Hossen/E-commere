import { ShoppingBag, Heart } from 'lucide-react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';

const ProductCard = ({ product, onAddToCart }) => {
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const wishlisted = isInWishlist(product.id);
  const imageUrl =
    product.images?.[0]?.image ||
    'data:image/svg+xml;utf8,' +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="100%" height="100%" fill="#f4f4f5"/><text x="50%" y="52%" font-family="sans-serif" font-size="16" fill="#a1a1aa" text-anchor="middle">No Image</text></svg>`
      );

  return (
    <div className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      {/* Badge */}
      {product.discounted_price < product.price && (
        <span className="absolute top-3 left-3 z-10 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full shadow-md shadow-primary-500/40">
          Sale
        </span>
      )}

      {/* Image Showcase — click anywhere on image to open details */}
      <Link
        to={`/product/${product.id}`}
        className="relative block aspect-square overflow-hidden bg-gray-50"
      >
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              toggleWishlist(product.id);
            }}
            aria-label="Toggle wishlist"
            className={`p-3 rounded-full transition-colors ${
              wishlisted
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-800 hover:bg-primary-600 hover:text-white'
            }`}
          >
            <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onAddToCart(product.id);
            }}
            className="p-3 bg-white text-gray-800 rounded-full hover:bg-primary-600 hover:text-white transition-colors"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-4 text-center">
        <p className="text-[11px] text-primary-600 uppercase tracking-[0.2em] mb-1 font-medium">
          {product.category?.name || 'Footwear'}
        </p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display font-semibold text-gray-900 text-base tracking-tight hover:text-primary-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center justify-center gap-2">
          {product.discounted_price < product.price ? (
            <>
              <span className="text-lg font-bold text-gray-900">৳{product.discounted_price}</span>
              <span className="text-sm text-gray-400 line-through">৳{product.price}</span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">৳{product.price}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;