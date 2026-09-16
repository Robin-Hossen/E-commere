import { useEffect, useState, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { unwrapList } from '../api/endpoints';
import ProductCard from '../components/ProductCard';
import { CartContext } from '../context/CartContext';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  // URL e ?category=<id> thakle sheta diye shuru korbe (home theke category click korle)
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [limitedOnly, setLimitedOnly] = useState(false);
  const [ordering, setOrdering] = useState('-created_at'); // Default: Newest
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    // Categories Fetch
    axiosInstance
      .get('categories/')
      .then((res) => setCategories(unwrapList(res.data)))
      .catch((err) => console.error('Failed to load categories:', err));
  }, []);

  useEffect(() => {
    // Home page theke category/search click korle URL update hoy — sheta follow koro
    const urlCategory = (searchParams.get('category') || '').trim();
    const urlSearch = searchParams.get('search') || '';

    // Special keywords: "all" = shob product, "limited" = just limited (discount) product
    if (urlCategory.toLowerCase() === 'all') {
      setSelectedCategory('');
      setLimitedOnly(false);
    } else if (urlCategory.toLowerCase() === 'limited') {
      setSelectedCategory('');
      setLimitedOnly(true);
    } else if (urlCategory && isNaN(Number(urlCategory))) {
      // Admin category er NAME likhle (jemon "electronics") — name diye id khuje ber koro
      setSelectedCategory(urlCategory.toLowerCase()); // placeholder, niche resolve hobe
      setLimitedOnly(false);
    } else {
      setSelectedCategory(urlCategory);
      setLimitedOnly(false);
    }
    setSearchQuery(urlSearch);
  }, [searchParams]);

  // Category name ke id-te convert koro (categories load hoye jawar por)
  useEffect(() => {
    const raw = (searchParams.get('category') || '').trim();
    if (raw && isNaN(Number(raw)) && raw.toLowerCase() !== 'all' && raw.toLowerCase() !== 'limited') {
      const target = raw.toLowerCase();
      const match = categories.find(
        (c) =>
          c.name?.toLowerCase().trim() === target ||
          c.slug?.toLowerCase() === target ||
          c.name?.toLowerCase().includes(target)
      );
      setSelectedCategory(match ? match.id : '');
    }
  }, [categories, searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Products Fetch with DRF Filters
    // Category NAME ekhono id-te resolve hoy nai (placeholder string) — fetch skip koro,
    // resolve effect categories load korlei id set korbe, tahole fetch abar cholbe.
    if (selectedCategory && isNaN(Number(selectedCategory))) return;

    let params = { ordering };
    if (selectedCategory) params.category = selectedCategory;
    if (limitedOnly) params.limited = 'true';
    if (searchQuery) params.search = searchQuery;

    const controller = new AbortController();
    axiosInstance
      .get('products/', { params, signal: controller.signal })
      .then((res) => setProducts(unwrapList(res.data)))
      .catch((thrown) => {
        if (axiosInstance.isCancel?.(thrown) || thrown.name === 'CanceledError') return;
        console.error('Failed to load products:', thrown);
      });
    return () => controller.abort();
  }, [selectedCategory, searchQuery, ordering, limitedOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">

        {/* Sidebar Filters */}
        <aside className="w-full md:w-1/4 space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-3 border-b pb-2">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`block w-full text-left py-1 ${!selectedCategory ? 'font-bold text-black' : 'text-gray-500'}`}
                >
                  All Categories
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`block w-full text-left py-1 ${selectedCategory === cat.id ? 'font-bold text-black' : 'text-gray-500'}`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          {/* Top Control Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border px-4 py-2 rounded-lg w-full sm:w-64 text-sm focus:outline-none"
            />

            <select
              value={ordering}
              onChange={(e) => setOrdering(e.target.value)}
              className="border px-4 py-2 rounded-lg text-sm bg-white"
            >
              <option value="-created_at">Sort by: Newest</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(id) => addToCart(id, 1)}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Shop;