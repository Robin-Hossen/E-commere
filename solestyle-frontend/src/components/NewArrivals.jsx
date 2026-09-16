import { useContext } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useFetch } from "../hooks/useFetch";
import { unwrapList } from "../api/endpoints";
import { CartContext } from "../context/CartContext";

const NewArrivals = () => {
  const { data } = useFetch("products/", {
    ordering: "-created_at",
    page_size: 8,
  });
  const products = (unwrapList(data) || []).slice(0, 4);
  const { addToCart } = useContext(CartContext);

  if (products.length === 0) return null;

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-500/10 px-4 py-1.5 text-sm font-medium text-primary-600">
              Just Dropped
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold text-gray-900 sm:text-4xl">
              New Arrivals
            </h2>
            <p className="mt-2 text-gray-600">
              Fresh styles just landed — be the first to rock them
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 font-medium text-primary-600 transition-colors hover:text-primary-700"
          >
            Shop New Arrivals
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

        {/* Products Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative overflow-hidden rounded-2xl bg-gray-50"
            >
              {/* NEW badge */}
              <span className="absolute left-3 top-3 z-10 rounded-full bg-gray-950 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase">
                New
              </span>

              {/* Image */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={
                    product.images?.[0]?.image ||
                    "https://placehold.co/400x400/f4f4f5/a1a1aa?text=No+Image"
                  }
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Add to cart button */}
                <button
                  onClick={() => addToCart(product.id, 1)}
                  className="absolute bottom-3 right-3 z-10 flex h-11 w-11 translate-y-14 items-center justify-center rounded-full bg-gray-950 text-white shadow-lg transition-all duration-300 hover:bg-primary-600 group-hover:translate-y-0"
                  aria-label="Add to Cart"
                >
                  <ShoppingBag size={18} />
                </button>
              </div>

              {/* Info */}
              <div className="p-5">
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-primary-600">
                  {product.category?.name || "Footwear"}
                </p>
                <h3 className="mt-1 font-display font-semibold text-gray-900">
                  {product.name}
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of stock"}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    ৳{product.discounted_price ?? product.price}
                  </span>
                  {product.discounted_price < product.price && (
                    <span className="text-sm text-gray-400 line-through">
                      ৳{product.price}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
