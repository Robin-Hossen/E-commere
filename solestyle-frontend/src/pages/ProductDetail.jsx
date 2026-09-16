import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductDetail, unwrapList } from '../api/endpoints';
import axiosInstance from '../api/axiosInstance';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Star } from 'lucide-react';

const StarRating = ({ value, onChange, size = 22 }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((num) => (
      <button
        key={num}
        type="button"
        onClick={() => onChange && onChange(num)}
        className={`${onChange ? 'cursor-pointer transition-transform hover:scale-110' : 'cursor-default'}`}
        aria-label={`${num} star`}
      >
        <Star
          size={size}
          className={num <= value ? 'text-yellow-400' : 'text-gray-300'}
          fill={num <= value ? 'currentColor' : 'none'}
        />
      </button>
    ))}
  </div>
);

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProductDetail(id)
      .then((res) => {
        setProduct(res.data);
        if (res.data.images?.length > 0) {
          setSelectedImage(res.data.images[0].image);
        }
      })
      .catch(() => setError('Failed to load product. Please try again.'));

    // Fetch Reviews (unwrap paginated results)
    axiosInstance.get(`reviews/?product=${id}`)
      .then((res) => setReviews(unwrapList(res.data)))
      .catch((err) => console.error('Failed to load reviews:', err));
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await axiosInstance.post('reviews/', {
        product_id: id,
        rating: newRating,
        comment: newComment,
      });
      const newReview = res.data;
      setReviews((prev) => [...prev, newReview]);
      setNewComment('');
      setNewRating(5);
      // Refresh product to update average rating
      fetchProductDetail(id).then((res) => setProduct(res.data)).catch(() => {});
    } catch (err) {
      const msg = err.response?.data;
      alert(typeof msg === 'object' ? Object.values(msg).flat().join(' ') : 'Review submission failed!');
    } finally {
      setSubmitting(false);
    }
  };

  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!product) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Image Gallery */}
        <div>
          <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden border mb-4">
            <img
              src={selectedImage || 'https://via.placeholder.com/600'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-4 overflow-x-auto">
            {product.images?.map((imgObj) => (
              <button
                key={imgObj.id}
                onClick={() => setSelectedImage(imgObj.image)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                  selectedImage === imgObj.image ? 'border-black' : 'border-transparent'
                }`}
              >
                <img src={imgObj.image} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-red-500">
            {product.category?.name}
          </span>
          <h1 className="text-3xl font-black text-gray-900">{product.name}</h1>

          <div className="flex items-center gap-4">
            {product.discounted_price < product.price ? (
              <>
                <span className="text-3xl font-bold">৳{product.discounted_price}</span>
                <span className="text-xl text-gray-400 line-through">৳{product.price}</span>
              </>
            ) : (
              <span className="text-3xl font-bold">৳{product.price}</span>
            )}
            <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
              In Stock: {product.stock}
            </span>
          </div>

          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-700">Quantity:</span>
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-gray-100 font-bold"
              >
                -
              </button>
              <span className="px-4 font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-4 py-2 hover:bg-gray-100 font-bold"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={() => addToCart(product.id, quantity)}
            className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition"
          >
            ADD TO CART
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 border-t border-gray-100 pt-12">
        {/* Header with average rating summary */}
        <div className="flex flex-col items-start justify-between gap-6 mb-10 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
              Customer Reviews
            </h2>
            <div className="mt-3 flex items-center gap-3">
              <StarRating value={Math.round(product.rating_average || 0)} size={20} />
              <span className="text-lg font-bold text-gray-900">
                {product.rating_average ?? 'No'}
                {product.rating_average && ' / 5'}
              </span>
              <span className="text-sm text-gray-500">
                ({product.review_count || 0} review{(product.review_count || 0) === 1 ? '' : 's'})
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          {/* Review List (3/5) */}
          <div className="space-y-4 lg:col-span-3">
            {reviews.length === 0 && (
              <div className="rounded-2xl bg-gray-50 p-8 text-center">
                <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
              </div>
            )}
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-600">
                      {(rev.user?.username || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">
                        {rev.user?.username || 'User'}
                      </span>
                      <p className="text-xs text-gray-400">
                        {new Date(rev.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <StarRating value={rev.rating} size={16} />
                </div>
                <p className="mt-4 text-gray-600 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>

          {/* Add Review Form (2/5) */}
          <div className="lg:col-span-2">
            {user ? (
              <form
                onSubmit={handleReviewSubmit}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-6 space-y-5"
              >
                <h3 className="font-display text-lg font-bold text-gray-900">Leave a Review</h3>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Your Rating</label>
                  <StarRating value={newRating} onChange={setNewRating} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Comment</label>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                    required
                    placeholder="Share your experience with this product..."
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-primary-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-primary-600 py-3 font-semibold text-white shadow-lg shadow-primary-600/30 transition hover:bg-primary-700 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center">
                <h3 className="font-display text-lg font-bold text-gray-900">Leave a Review</h3>
                <p className="mt-2 text-sm text-gray-500">Log in to share your review.</p>
                <Link
                  to="/login"
                  className="mt-4 inline-block rounded-full bg-primary-600 px-6 py-2.5 font-semibold text-white shadow-lg shadow-primary-600/30 transition hover:bg-primary-700"
                >
                  Go to Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;