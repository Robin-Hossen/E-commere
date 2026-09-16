import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories, fetchProducts, unwrapList } from '../api/endpoints';
import ProductCard from '../components/ProductCard';
import { CartContext } from '../context/CartContext';

// Import All Components
import ServicesBanner from '../components/ServicesBanner';
import SpecialOffer from '../components/SpecialOffer';
import DiscountDeals from '../components/DiscountDeals';
import Testimonials from '../components/Testimonials';
import CategoryShowcase from '../components/CategoryShowcase';
import NewArrivals from '../components/NewArrivals';
import CtaBanner from '../components/CtaBanner';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetchProducts()
      .then((res) => {
        const list = unwrapList(res.data);
        setProducts(list);
        setProductCount(res.data?.count ?? list.length);
      })
      .catch((err) => console.error(err));
    fetchCategories()
      .then((res) => setCategoryCount(res.data?.count ?? unwrapList(res.data).length))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        {/* Hero Section */}
        <section className="relative min-h-[90vh] overflow-hidden bg-gray-950">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary-500/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-primary-600/10 blur-3xl" />
          </div>

          <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
            {/* Hero Content */}
            <div>
              <span className="inline-block rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1.5 text-sm font-medium text-primary-400">
                New Collection 2032
              </span>
              <h1 className="mt-6 font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
                Step Into{' '}
                <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                  Your Best
                </span>
              </h1>
              <p className="mt-6 max-w-lg text-lg text-gray-400">
                Premium footwear for every step of your journey. From athletic
                performance to everyday comfort.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/shop?category=sneackers"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-600 px-8 py-4 font-semibold text-white shadow-lg shadow-primary-600/30 transition-all hover:bg-primary-700 hover:shadow-primary-700/40"
                >
                  Shop Now
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  to="/categories"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-white/20 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10 sm:w-auto"
                >
                  Browse Categories
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-16 flex items-center justify-center gap-8 border-t border-white/10 pt-8 lg:justify-start">
                <div>
                  <div className="font-display text-3xl font-bold text-white">{categoryCount}</div>
                  <div className="text-sm text-gray-500">Categories</div>
                </div>
                <div className="h-12 w-px bg-white/10" />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-display text-3xl font-bold text-white">4.9</span>
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="text-sm text-gray-500">Average Rating</div>
                </div>
                <div className="h-12 w-px bg-white/10" />
                <div>
                  <div className="font-display text-3xl font-bold text-white">{productCount}</div>
                  <div className="text-sm text-gray-500">Styles Available</div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative hidden lg:block">
              <div className="relative z-10 float-animation">
                <img
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop"
                  alt="Featured sneaker"
                  className="w-full rounded-3xl object-cover drop-shadow-2xl"
                />
              </div>
              {/* Floating badges */}
              <div className="absolute -left-8 top-1/4 z-20 rounded-xl bg-white/10 p-4 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                    <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Free Shipping</p>
                    <p className="text-xs text-gray-400">Orders over ৳5000</p>
                  </div>
                </div>
              </div>
              <div className="absolute -right-8 bottom-1/4 z-20 rounded-xl bg-white/10 p-4 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500/20">
                    <svg className="h-5 w-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Easy Returns</p>
                    <p className="text-xs text-gray-400">60-day guarantee</p>
                  </div>
                </div>
              </div>
              {/* Sale badge */}
              <div className="absolute right-8 top-8 z-20">
                <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-primary-500 shadow-lg shadow-primary-500/50">
                  <span className="text-xs font-bold text-white">UP TO</span>
                  <span className="font-display text-2xl font-bold text-white">40%</span>
                  <span className="text-xs font-bold text-white">OFF</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <a href="#featured" className="group flex flex-col items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-500 transition-colors group-hover:text-white">
                Explore
              </span>
              <svg className="h-5 w-5 scroll-bounce text-gray-500 transition-colors group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
          </div>
        </section>

        {/* 1. Services / Policy Highlights */}
        <ServicesBanner />

        {/* 2. Shop by Category (demo style image cards) */}
        <CategoryShowcase />

        {/* Featured Products */}
        <section id="featured" className="bg-white max-w-7xl mx-auto py-20 px-4 lg:py-28">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row mb-12">
            <div>
              <h2 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
                Featured Collection
              </h2>
              <p className="mt-2 text-gray-600">
                Our most popular styles handpicked for you
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 font-medium text-primary-600 transition-colors hover:text-primary-700"
            >
              View All Featured
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(id) => addToCart(id, 1)}
              />
            ))}
          </div>
        </section>

        {/* 3. Special Promo Banner */}
        <SpecialOffer />

        {/* 3.5 Hot Deals — shudhu discount product gula */}
        <DiscountDeals />

        {/* 4. New Arrivals */}
        <NewArrivals />

        {/* 5. Customer Testimonials (dark) */}
        <Testimonials />

        {/* 6. CTA + App Download banner */}
        <CtaBanner />

        {/* 7. Newsletter */}
        <Newsletter />
      </div>

      {/* 6. Footer Section */}
      <Footer />
    </div>
  );
};

export default Home;