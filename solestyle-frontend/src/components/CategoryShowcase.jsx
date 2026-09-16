import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { unwrapList } from "../api/endpoints";

const CATEGORY_IMAGES = {
  running:
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop",
  sneakers:
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=400&fit=crop",
  basketball:
    "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=600&h=400&fit=crop",
  casual:
    "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&h=400&fit=crop",
  boots:
    "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&h=400&fit=crop",
  sandals:
    "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&h=400&fit=crop",
};

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&h=400&fit=crop",
];

const CategoryShowcase = () => {
  const { data } = useFetch("categories/");
  const categories = unwrapList(data);

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <h2 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
              Shop by Category
            </h2>
            <p className="mt-2 text-gray-600">
              Find the perfect pair for every occasion
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 font-medium text-primary-600 transition-colors hover:text-primary-700"
          >
            View All
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

        {/* Categories Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, index) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.id}`}
              state={{ category: cat }}
              className="group relative overflow-hidden rounded-2xl"
            >
              <div className="aspect-[4/3]">
                <img
                  src={
                    cat.image ||
                    CATEGORY_IMAGES[cat.slug] ||
                    FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]
                  }
                  alt={cat.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-70 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-6 transition-transform">
                <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {cat.product_count || 0} products
                </span>
                <h3 className="mt-3 font-display text-2xl font-bold text-white">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="mt-1 line-clamp-1 text-sm text-gray-300">
                    {cat.description}
                  </p>
                )}
                <div className="mt-4 inline-flex items-center gap-2 font-medium text-white">
                  Shop Now
                  <svg
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
