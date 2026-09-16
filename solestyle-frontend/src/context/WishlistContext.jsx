/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "./AuthContext";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState(null); // { id, products: [...] }
  const [wishlistIds, setWishlistIds] = useState(new Set());

  const refreshWishlist = useCallback(async () => {
    if (!user) {
      setWishlist(null);
      setWishlistIds(new Set());
      return;
    }
    try {
      const res = await axiosInstance.get("wishlists/");
      const list = res.data?.results?.[0] || res.data?.[0] || null;
      setWishlist(list);
      setWishlistIds(new Set((list?.products || []).map((p) => p.id)));
    } catch (err) {
      console.error("Failed to load wishlist:", err);
      setWishlist(null);
      setWishlistIds(new Set());
    }
  }, [user]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  const toggleWishlist = useCallback(
    async (productId) => {
      if (!user) {
        alert("Please log in to use the wishlist.");
        return;
      }
      try {
        if (wishlistIds.has(productId)) {
          // Remove: PATCH the wishlist without that product id
          const currentIds = [...wishlistIds].filter((id) => id !== productId);
          await axiosInstance.patch(`wishlists/${wishlist.id}/`, {
            product_ids: currentIds,
          });
        } else {
          // Add: create wishlist if missing, else PATCH with new ids
          if (wishlist) {
            await axiosInstance.patch(`wishlists/${wishlist.id}/`, {
              product_ids: [...wishlistIds, productId],
            });
          } else {
            await axiosInstance.post("wishlists/", {
              product_ids: [productId],
            });
          }
        }
        await refreshWishlist();
      } catch (err) {
        console.error("Wishlist update failed:", err.response?.data || err);
        alert("Could not update wishlist. Are you logged in?");
      }
    },
    [user, wishlist, wishlistIds, refreshWishlist],
  );

  const isInWishlist = useCallback(
    (productId) => wishlistIds.has(productId),
    [wishlistIds],
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistIds,
        toggleWishlist,
        isInWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
