import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { unwrapList } from "../api/endpoints";
import ProductCard from "../components/ProductCard";
import { CartContext } from "../context/CartContext";

// Home page er "Hot Deals" section — shudhu discount asa product gula dekhabe
const DiscountDeals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    axiosInstance
      .get("products/")
      .then((res) => {
        const list = unwrapList(res.data) || [];
        // Discount percentage > 0 — shudhu discount product gula
        setProducts(
          list.filter((p) => (p.discount_percentage ?? 0) > 0).slice(0, 8),
        );
      })
      .catch((err) => console.error("Failed to load deals:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || products.length === 0) return null;

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row mb-10">
          <div>
            <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-600">
              🔥 Limited Time
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-gray-900 sm:text-4xl">
              Hot Deals
            </h2>
            <p className="mt-2 text-gray-600">
              Shudhu discount asa product gula — oshomapto offer!
            </p>
          </div>
          <Link
            to="/sale"
            className="inline-flex items-center gap-2 font-medium text-red-600 transition-colors hover:text-red-700"
          >
            View All Sale Items
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={(id) => addToCart(id, 1)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DiscountDeals;
