import axiosInstance from './axiosInstance';

export const unwrapList = (data) => data?.results ?? data ?? [];

export const fetchCategories = () => axiosInstance.get('categories/');
export const fetchProducts = (params) => axiosInstance.get('products/', { params });
export const fetchProductDetail = (id) => axiosInstance.get(`products/${id}/`);
export const fetchCart = () => axiosInstance.get('carts/');
export const addToCart = (productId, quantity = 1) => 
  axiosInstance.post('cart-items/', { product_id: productId, quantity });
export const createOrder = () => axiosInstance.post('orders/', {});
export const initiatePayment = (orderId) => 
  axiosInstance.post('payment/initiate/', { order_id: orderId });