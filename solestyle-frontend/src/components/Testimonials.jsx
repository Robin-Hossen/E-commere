import { useState, useEffect, useRef, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [customerCount, setCustomerCount] = useState(0);
  const pauseRef = useRef(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axiosInstance.get('reviews/');
        const data = res.data?.results || res.data;
        setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load reviews:', err);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
    // Count distinct customers from users endpoint
    axiosInstance
      .get('users/')
      .then((res) => {
        const data = res.data?.results || res.data;
        setCustomerCount(Array.isArray(data) ? data.length : 0);
      })
      .catch((err) => console.error('Failed to load users:', err));
  }, []);

  // Responsive visible count
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setVisibleCount(w >= 1024 ? 3 : w >= 640 ? 2 : 1);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const maxIndex = Math.max(0, reviews.length - visibleCount);

  const next = useCallback(
    () => setIndex((i) => (reviews.length === 0 ? 0 : i >= maxIndex ? 0 : i + 1)),
    [maxIndex, reviews.length]
  );
  const prev = useCallback(
    () => setIndex((i) => (reviews.length === 0 ? 0 : i <= 0 ? maxIndex : i - 1)),
    [maxIndex, reviews.length]
  );

  // Auto-slide every 4s
  useEffect(() => {
    if (reviews.length <= visibleCount) return;
    const timer = setInterval(() => {
      if (!pauseRef.current) next();
    }, 4000);
    return () => clearInterval(timer);
  }, [next, reviews.length, visibleCount]);

  useEffect(() => {
    if (index > maxIndex) setIndex(0);
  }, [index, maxIndex]);

  // Real stats computed from fetched reviews
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews).toFixed(1)
      : '—';
  const fiveStarCount = reviews.filter((r) => r.rating === 5).length;
  const recommendPct =
    totalReviews > 0
      ? Math.round((reviews.filter((r) => (r.rating || 0) >= 4).length / totalReviews) * 100)
      : '—';

  const initials = (name) =>
    (name || 'U')
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

  return (
    <section className="bg-gray-950 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-500/10 px-4 py-1.5 text-sm font-medium text-primary-400">
            Customer Love
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-400">
            Join thousands of happy customers who have made SoleStyle their go-to footwear brand
          </p>
        </div>

        {/* Customer Count */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col items-center rounded-2xl bg-gray-900 px-12 py-8">
            <div className="flex items-center -space-x-3">
              {[...Array(Math.min(5, customerCount || 5))].map((_, i) => (
                <div
                  key={i}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-950 bg-primary-500/30 text-sm font-semibold text-primary-300"
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
              {customerCount > 5 && (
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-950 bg-primary-500 text-xs font-bold text-white">
                  +{customerCount - 5}
                </div>
              )}
            </div>
            <p className="mt-4 font-display text-3xl font-bold text-white">
              {customerCount > 0 ? `${customerCount.toLocaleString()}+` : '—'}
            </p>
            <p className="text-sm text-gray-500">Happy Customers</p>
          </div>
        </div>

        {/* Testimonials Slider */}
        {loading ? (
          <div className="mt-16 text-center text-gray-500">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="mt-16 text-center text-gray-500">No reviews yet.</div>
        ) : (
          <div
            className="relative mt-16"
            onMouseEnter={() => (pauseRef.current = true)}
            onMouseLeave={() => (pauseRef.current = false)}
          >
            <div className="overflow-hidden">
              <div
                className="flex gap-6 transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(calc(-${index} * (100% / ${visibleCount})))`,
                }}
              >
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="shrink-0 rounded-2xl bg-gray-900 p-8"
                    style={{ width: `calc((100% - ${(visibleCount - 1) * 1.5}rem) / ${visibleCount})` }}
                  >
                    {/* Stars */}
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={i < rev.rating ? 'text-yellow-400' : 'text-gray-700'}
                          fill="currentColor"
                        />
                      ))}
                    </div>
                    {/* Quote */}
                    <blockquote className="mt-6 text-lg text-gray-300">"{rev.comment}"</blockquote>
                    {/* Author */}
                    <div className="mt-8 flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-500/20 font-semibold text-primary-400">
                        {initials(rev.user?.first_name || rev.user?.username)}
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {rev.user?.first_name || rev.user?.username || 'Customer'}
                        </p>
                        <p className="text-sm text-gray-500">{rev.product?.name || 'Verified Buyer'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Arrows */}
            {reviews.length > visibleCount && (
              <div className="mt-8 flex justify-center gap-3">
                <button
                  onClick={prev}
                  className="rounded-full border border-white/10 bg-gray-900 p-2.5 text-gray-400 transition hover:bg-primary-500 hover:text-white"
                  aria-label="Previous review"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={next}
                  className="rounded-full border border-white/10 bg-gray-900 p-2.5 text-gray-400 transition hover:bg-primary-500 hover:text-white"
                  aria-label="Next review"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Stats Row */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 border-t border-white/10 pt-12 text-center sm:gap-x-20">
          <div>
            <div className="font-display text-3xl font-bold text-white sm:text-4xl">{totalReviews}</div>
            <p className="mt-1 text-sm text-gray-500">Total Reviews</p>
          </div>
          <div>
            <div className="font-display text-3xl font-bold text-white sm:text-4xl">{avgRating}/5</div>
            <p className="mt-1 text-sm text-gray-500">Average Rating</p>
          </div>
          <div>
            <div className="font-display text-3xl font-bold text-white sm:text-4xl">{fiveStarCount}</div>
            <p className="mt-1 text-sm text-gray-500">5-Star Reviews</p>
          </div>
          <div>
            <div className="font-display text-3xl font-bold text-white sm:text-4xl">
              {customerCount > 0 ? customerCount.toLocaleString() : '—'}
            </div>
            <p className="mt-1 text-sm text-gray-500">Happy Customers</p>
          </div>
          <div>
            <div className="font-display text-3xl font-bold text-white sm:text-4xl">{recommendPct}%</div>
            <p className="mt-1 text-sm text-gray-500">Would Recommend</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;