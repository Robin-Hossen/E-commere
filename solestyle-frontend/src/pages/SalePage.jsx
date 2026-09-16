import { useEffect, useState, useContext } from "react";
import axiosInstance from "../api/axiosInstance";
import { unwrapList } from "../api/endpoints";
import ProductCard from "../components/ProductCard";
import { CartContext } from "../context/CartContext";

const SalePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    axiosInstance
      .get("products/")
      .then((res) => {
        const list = unwrapList(res.data) || [];
        // Shudhu discount asa product gulo dekhabo
        setProducts(list.filter((p) => (p.discount_percentage ?? 0) > 0));
      })
      .catch((err) => console.error("Failed to load products:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
        Sale
      </h1>
      <p className="text-gray-600 mb-8">
        Discounted products — grab them before they're gone
      </p>

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No discounted products right now.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
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

export default SalePage;
