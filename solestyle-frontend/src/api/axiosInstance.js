import axios from 'axios';

// Production e VITE_API_URL set korte hobe (jemon https://solestyle.onrender.com/api/)
// Local dev e /api/ proxy diye cholbe
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;