import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { unwrapList } from "../api/endpoints";

const CategoriesPage = () => {
  const { data } = useFetch("categories/");
  const categories = unwrapList(data) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
        Shop by Category
      </h1>
      <p className="text-gray-600 mb-8">
        Choose a category to browse its products
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/shop?category=${cat.id}`}
            className="group relative overflow-hidden rounded-2xl"
          >
            {cat.image && (
              <div className="aspect-[4/3]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}
            <div
              className={
                cat.image
                  ? "absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-70"
                  : "absolute inset-0 bg-gray-900 opacity-80"
              }
            />
            <div className="absolute bottom-0 left-0 right-0 p-6">
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
              <span className="mt-4 inline-flex items-center gap-2 font-medium text-primary-300 group-hover:text-primary-200">
                Shop Now →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
