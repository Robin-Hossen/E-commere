import { useEffect, useState, useContext } from "react";
import axiosInstance from "../api/axiosInstance";
import { unwrapList } from "../api/endpoints";
import { AuthContext } from "../context/AuthContext";

const TABS = [
  { key: "products", label: "Products" },
  { key: "categories", label: "Categories" },
  { key: "banners", label: "Promo Banner" },
  { key: "orders", label: "Orders" },
  { key: "users", label: "Users" },
];

const ORDER_STATUSES = [
  "Pending",
  "Processing",
  "Paid",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const emptyCategory = { name: "", slug: "", description: "", image: null };

const emptyProduct = {
  name: "",
  description: "",
  price: "",
  stock: "",
  discount_percentage: 0,
  category_id: "",
};

const Admin = () => {
  const { user } = useContext(AuthContext);
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null); // null | 'new' | product object
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // null | 'new' | category
  const [categoryForm, setCategoryForm] = useState(emptyCategory);
  const [categoryImageFile, setCategoryImageFile] = useState(null);
  const [banners, setBanners] = useState([]);
  const [bannerForm, setBannerForm] = useState(null); // null = closed, object = editing
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [newImageFiles, setNewImageFiles] = useState([]); // multiple files for create/edit

  const loadAll = () => {
    axiosInstance
      .get("products/")
      .then((res) => setProducts(unwrapList(res.data)))
      .catch(() => {});
    axiosInstance
      .get("categories/")
      .then((res) => setCategories(unwrapList(res.data)))
      .catch(() => {});
    axiosInstance
      .get("orders/")
      .then((res) => setOrders(unwrapList(res.data)))
      .catch(() => {});
    axiosInstance
      .get("users/")
      .then((res) => setUsers(unwrapList(res.data)))
      .catch(() => {});
    axiosInstance
      .get("promo-banners/")
      .then((res) => setBanners(unwrapList(res.data)))
      .catch(() => {});
  };

  useEffect(() => {
    loadAll();
  }, []);

  if (!user?.isStaff) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <h1 className="text-3xl font-black mb-4">Admin Access Required</h1>
        <p className="text-gray-500">
          You must be logged in as an admin (staff) user to view this page.
        </p>
      </div>
    );
  }

  const startCreate = () => {
    setForm(emptyProduct);
    setNewImageFiles([]);
    setEditing("new");
  };

  const startCreateBanner = () => {
    setBannerForm({
      id: "new",
      title: "Special Promo",
      heading: "20% Off For All Products",
      description: "",
      button_text: "SHOP NOW",
      button_link: "/shop",
      is_active: true,
    });
    setBannerImageFile(null);
  };

  const startBannerEdit = (b) => {
    setBannerForm({
      id: b.id,
      title: b.title || "",
      heading: b.heading || "",
      description: b.description || "",
      button_text: b.button_text || "",
      button_link: b.button_link || "",
      is_active: b.is_active ?? true,
    });
    setBannerImageFile(null);
  };

  const handleBannerSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = new FormData();
      payload.append("title", bannerForm.title);
      payload.append("heading", bannerForm.heading);
      payload.append("description", bannerForm.description || "");
      payload.append("button_text", bannerForm.button_text);
      payload.append("button_link", bannerForm.button_link);
      payload.append("is_active", bannerForm.is_active);
      if (bannerImageFile) payload.append("image", bannerImageFile);
      const url =
        bannerForm.id === "new"
          ? "promo-banners/"
          : `promo-banners/${bannerForm.id}/`;
      await axiosInstance.request({
        method: bannerForm.id === "new" ? "post" : "patch",
        url,
        data: payload,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setBannerForm(null);
      loadAll();
    } catch {
      setError("Banner save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleBannerDelete = async (b) => {
    if (!window.confirm(`Delete banner "${b.title}"?`)) return;
    try {
      await axiosInstance.delete(`promo-banners/${b.id}/`);
      loadAll();
    } catch {
      setError("Delete failed.");
    }
  };

  const startCreateCategory = () => {
    setCategoryForm(emptyCategory);
    setCategoryImageFile(null);
    setEditingCategory("new");
  };

  const startEditCategory = (cat) => {
    setCategoryForm({
      name: cat.name || "",
      slug: cat.slug || "",
      description: cat.description || "",
      image: cat.image || null,
    });
    setCategoryImageFile(null);
    setEditingCategory(cat);
  };

  const handleCategorySave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      // image file thakle multipart/form-data diye pathate hobe
      const payload = new FormData();
      payload.append("name", categoryForm.name);
      payload.append("slug", categoryForm.slug);
      payload.append("description", categoryForm.description || "");
      if (categoryImageFile) {
        payload.append("image", categoryImageFile);
      }
      if (editingCategory === "new") {
        await axiosInstance.post("categories/", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axiosInstance.patch(
          `categories/${editingCategory.id}/`,
          payload,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
      }
      setEditingCategory(null);
      loadAll();
    } catch (err) {
      const data = err.response?.data;
      const msg =
        typeof data === "object" && data !== null
          ? Object.values(data).flat().join(" ")
          : data;
      setError(msg || "Category save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleCategoryDelete = async (cat) => {
    if (
      !window.confirm(
        `Delete category "${cat.name}"? Products inside it will also be deleted.`,
      )
    )
      return;
    try {
      await axiosInstance.delete(`categories/${cat.id}/`);
      loadAll();
    } catch {
      setError("Category delete failed.");
    }
  };

  const startEdit = (product) => {
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      stock: product.stock ?? "",
      discount_percentage: product.discount_percentage ?? 0,
      category_id: product.category?.id || "",
    });
    setNewImageFiles([]);
    setEditing(product);
  };

  // Always render the editing form from the freshest product data so that
  // newly uploaded images appear immediately after loadAll() refreshes.
  const editingProduct =
    editing && editing !== "new"
      ? products.find((p) => p.id === editing.id) || editing
      : editing;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      name: form.name,
      description: form.description,
      price: form.price,
      stock: Number(form.stock),
      discount_percentage: Number(form.discount_percentage),
      category_id: Number(form.category_id),
    };
    try {
      if (newImageFiles.length > 0) {
        // Multipart request: product fields + multiple images in one go
        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) =>
          formData.append(key, value),
        );
        newImageFiles.forEach((file) =>
          formData.append("uploaded_images", file),
        );
        if (editing === "new") {
          await axiosInstance.post("products/", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          await axiosInstance.patch(`products/${editing.id}/`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      } else if (editing === "new") {
        await axiosInstance.post("products/", payload);
      } else {
        await axiosInstance.patch(`products/${editing.id}/`, payload);
      }
      setNewImageFiles([]);
      setEditing(null);
      loadAll();
    } catch (err) {
      const data = err.response?.data;
      const msg =
        typeof data === "object" && data !== null
          ? Object.values(data).flat().join(" ")
          : data;
      setError(msg || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`))
      return;
    try {
      await axiosInstance.delete(`products/${product.id}/`);
      loadAll();
    } catch {
      setError("Delete failed. Products linked to orders may be protected.");
    }
  };

  const updateOrderStatus = async (order, newStatus) => {
    try {
      await axiosInstance.patch(`orders/${order.id}/`, { status: newStatus });
      loadAll();
    } catch {
      setError("Failed to update order status.");
    }
  };

  // ---- Product image handling (multipart upload to product-images/) ----
  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!imageFile || editing === "new") return;
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("product_id", editing.id);
    formData.append("image", imageFile);
    try {
      await axiosInstance.post("product-images/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImageFile(null);
      loadAll();
    } catch (err) {
      const data = err.response?.data;
      const msg =
        typeof data === "object" && data !== null
          ? Object.values(data).flat().join(" ")
          : data;
      setError(msg || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleImageDelete = async (imageId) => {
    if (!window.confirm("Remove this image?")) return;
    try {
      await axiosInstance.delete(`product-images/${imageId}/`);
      loadAll();
    } catch {
      setError("Failed to remove image.");
    }
  };

  const inputCls =
    "w-full border p-2 rounded-lg focus:outline-none focus:border-black";

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-6">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-2 border-b mb-6">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setTab(t.key);
              setEditing(null);
            }}
            className={`px-4 py-2 font-bold ${tab === t.key ? "border-b-2 border-black text-black" : "text-gray-400"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg">
          {error}
        </p>
      )}

      {/* Products Tab */}
      {tab === "products" && (
        <div>
          <button
            onClick={startCreate}
            className="mb-4 bg-black text-white px-4 py-2 rounded-lg font-bold"
          >
            + Add Product
          </button>

          {editingProduct && (
            <form
              onSubmit={handleSave}
              className="p-6 border rounded-xl space-y-4 mb-6 bg-gray-50"
            >
              <h3 className="font-bold text-lg">
                {editingProduct === "new"
                  ? "New Product"
                  : `Edit: ${editingProduct.name}`}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    className={inputCls}
                    value={form.name}
                    required
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <select
                    className={inputCls}
                    value={form.category_id}
                    required
                    onChange={(e) =>
                      setForm({ ...form, category_id: e.target.value })
                    }
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price (৳)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className={inputCls}
                    value={form.price}
                    required
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    className={inputCls}
                    value={form.stock}
                    required
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Discount %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className={inputCls}
                    value={form.discount_percentage}
                    onChange={(e) =>
                      setForm({ ...form, discount_percentage: e.target.value })
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    className={inputCls}
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </div>
              </div>
              {/* Multi-image upload (works for both new & existing products) */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Images (একসাথে একাধিক সিলেক্ট করতে পারবেন)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    setNewImageFiles(Array.from(e.target.files || []))
                  }
                  className="text-sm"
                />
                {newImageFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newImageFiles.map((f, i) => (
                      <img
                        key={i}
                        src={URL.createObjectURL(f)}
                        alt=""
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-black text-white px-6 py-2 rounded-lg font-bold"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="border px-6 py-2 rounded-lg font-bold"
                >
                  Cancel
                </button>
              </div>

              {/* Image Section (only for existing products) */}
              {editingProduct !== "new" && (
                <div className="border-t pt-4">
                  <h4 className="font-bold mb-3">Product Images</h4>

                  {/* Existing images */}
                  <div className="flex flex-wrap gap-3 mb-4">
                    {(editingProduct.images || []).length === 0 && (
                      <p className="text-sm text-gray-400">
                        No images uploaded yet.
                      </p>
                    )}
                    {(editingProduct.images || []).map((img) => (
                      <div key={img.id} className="relative">
                        <img
                          src={img.image}
                          alt=""
                          className="w-24 h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => handleImageDelete(img.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Upload form */}
                  <form
                    onSubmit={handleImageUpload}
                    className="flex flex-wrap items-center gap-3"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={(e) => setImageFile(e.target.files[0] || null)}
                      className="text-sm"
                    />
                    <button
                      type="submit"
                      disabled={uploading || !imageFile}
                      className="bg-black text-white px-4 py-2 rounded-lg font-bold text-sm disabled:opacity-50"
                    >
                      {uploading ? "Uploading..." : "Upload Image"}
                    </button>
                  </form>
                  <p className="text-xs text-gray-400 mt-1">
                    Images upload after saving the product. First image is shown
                    as the main photo.
                  </p>
                </div>
              )}
            </form>
          )}

          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Discount</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="p-3">{p.id}</td>
                    <td className="p-3 font-semibold">{p.name}</td>
                    <td className="p-3">{p.category?.name}</td>
                    <td className="p-3">৳{p.price}</td>
                    <td className="p-3">{p.stock}</td>
                    <td className="p-3">{p.discount_percentage}%</td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => startEdit(p)}
                        className="text-blue-600 underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        className="text-red-500 underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Promo Banner Tab */}
      {tab === "banners" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              Homepage er "Special Promo" section ekhane theke control korun.
            </p>
            <button
              onClick={startCreateBanner}
              className="bg-black text-white px-4 py-2 rounded-lg font-bold"
            >
              + Add Banner
            </button>
          </div>
          {bannerForm && (
            <form
              onSubmit={handleBannerSave}
              className="p-6 border rounded-xl space-y-4 mb-6 bg-gray-50"
            >
              <h3 className="font-bold text-lg">
                {bannerForm.id === "new" ? "New Banner" : "Edit Banner"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title (small label)</label>
                  <input
                    className={inputCls}
                    value={bannerForm.title}
                    onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Heading</label>
                  <input
                    className={inputCls}
                    value={bannerForm.heading}
                    required
                    onChange={(e) => setBannerForm({ ...bannerForm, heading: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    rows={2}
                    className={inputCls}
                    value={bannerForm.description}
                    onChange={(e) => setBannerForm({ ...bannerForm, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Button Text</label>
                  <input
                    className={inputCls}
                    value={bannerForm.button_text}
                    onChange={(e) => setBannerForm({ ...bannerForm, button_text: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Button Link</label>
                  <input
                    className={inputCls}
                    placeholder="/shop?category=electronics | all | limited"
                    value={bannerForm.button_link}
                    onChange={(e) => setBannerForm({ ...bannerForm, button_link: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Examples: <code>/shop?category=all</code> (all products),{" "}
                    <code>/shop?category=electronics</code> (category name),{" "}
                    <code>/shop?category=limited</code> (limited/discount products),{" "}
                    <code>/shop?category=3</code> (category id)
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Banner Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className={inputCls}
                    onChange={(e) => setBannerImageFile(e.target.files[0])}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="banner-active"
                    checked={bannerForm.is_active}
                    onChange={(e) => setBannerForm({ ...bannerForm, is_active: e.target.checked })}
                  />
                  <label htmlFor="banner-active" className="text-sm">Active (homepage e dekhabe)</label>
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={saving} className="bg-black text-white px-6 py-2 rounded-lg font-bold">
                  {saving ? "Saving..." : "Save"}
                </button>
                <button type="button" onClick={() => setBannerForm(null)} className="border px-6 py-2 rounded-lg font-bold">
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Heading</th>
                  <th className="p-3">Image</th>
                  <th className="p-3">Active</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {banners.map((b) => (
                  <tr key={b.id} className="border-t">
                    <td className="p-3 font-semibold">{b.title}</td>
                    <td className="p-3">{b.heading}</td>
                    <td className="p-3">
                      {b.image ? (
                        <img src={b.image} alt={b.title} className="h-10 w-16 object-cover rounded" />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="p-3">{b.is_active ? "✅" : "❌"}</td>
                    <td className="p-3 flex gap-2">
                      <button onClick={() => startBannerEdit(b)} className="text-blue-600 underline">Edit</button>
                      <button onClick={() => handleBannerDelete(b)} className="text-red-500 underline">Delete</button>
                    </td>
                  </tr>
                ))}
                {banners.length === 0 && (
                  <tr><td colSpan={5} className="p-4 text-gray-400">No banners yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {tab === "categories" && (
        <div>
          <button
            onClick={startCreateCategory}
            className="mb-4 bg-black text-white px-4 py-2 rounded-lg font-bold"
          >
            + Add Category
          </button>

          {editingCategory && (
            <form
              onSubmit={handleCategorySave}
              className="p-6 border rounded-xl space-y-4 mb-6 bg-gray-50"
            >
              <h3 className="font-bold text-lg">
                {editingCategory === "new"
                  ? "New Category"
                  : `Edit: ${editingCategory.name}`}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    className={inputCls}
                    value={categoryForm.name}
                    required
                    placeholder="e.g. Sneakers"
                    onChange={(e) =>
                      setCategoryForm({ ...categoryForm, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Slug (unique, e.g. sneakers)
                  </label>
                  <input
                    className={inputCls}
                    value={categoryForm.slug}
                    required
                    pattern="[a-z0-9-]+"
                    title="Only lowercase letters, numbers and hyphens"
                    onChange={(e) =>
                      setCategoryForm({ ...categoryForm, slug: e.target.value })
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    className={inputCls}
                    value={categoryForm.description}
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Category Image (background picture)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className={inputCls}
                    onChange={(e) => setCategoryImageFile(e.target.files[0])}
                  />
                  {categoryImageFile ? (
                    <img
                      src={URL.createObjectURL(categoryImageFile)}
                      alt="preview"
                      className="mt-2 h-24 w-40 object-cover rounded-lg"
                    />
                  ) : categoryForm.image ? (
                    <img
                      src={categoryForm.image}
                      alt="current"
                      className="mt-2 h-24 w-40 object-cover rounded-lg"
                    />
                  ) : null}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-black text-white px-6 py-2 rounded-lg font-bold"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="border px-6 py-2 rounded-lg font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Image</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Slug</th>
                  <th className="p-3">Products</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="p-3">{c.id}</td>
                    <td className="p-3">
                      {c.image ? (
                        <img
                          src={c.image}
                          alt={c.name}
                          className="h-10 w-16 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="p-3 font-semibold">{c.name}</td>
                    <td className="p-3">{c.slug}</td>
                    <td className="p-3">
                      {products.filter((p) => p.category?.id === c.id).length}
                    </td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => startEditCategory(c)}
                        className="text-blue-600 underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleCategoryDelete(c)}
                        className="text-red-500 underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {tab === "orders" && (
        <div className="overflow-x-auto border rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Order #</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Change Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="p-3 font-semibold">#{o.id}</td>
                  <td className="p-3">{o.user?.username || o.user?.id}</td>
                  <td className="p-3">৳{o.total_price}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                      {o.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <select
                      value={o.status}
                      onChange={(e) => updateOrderStatus(o, e.target.value)}
                      className="border p-1 rounded text-sm"
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Users Tab */}
      {tab === "users" && (
        <div className="overflow-x-auto border rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Username</th>
                <th className="p-3">Email</th>
                <th className="p-3">Name</th>
                <th className="p-3">Staff</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-3">{u.id}</td>
                  <td className="p-3 font-semibold">{u.username}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">
                    {[u.first_name, u.last_name].filter(Boolean).join(" ")}
                  </td>
                  <td className="p-3">{u.is_staff ? "✅" : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admin;
