// filepath: /c:/Users/Admin/Desktop/SongPhatLong/src/app/_utils/globalApi.ts
import "dotenv/config";
import axios from "axios";

const apiKey = process.env.NEXT_PUBLIC_API_KEY;

const apiURL = "https://songphatlong-admin.onrender.com/api";

const axiosClient = axios.create({
  baseURL: apiURL,
  headers: {
    Authorization: `Bearer ${apiKey}`,
  },
});
// Only log in development environment
if (process.env.NODE_ENV !== "production") {
  axiosClient.interceptors.request.use((config) => {
    console.log("Request Config:", config);
    return config;
  });

  axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("Axios Error:", error.response?.data || error.message);
      return Promise.reject(error);
    }
  );
} else {
  // Minimal error logging in production
  axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("API Error:", error.message);
      return Promise.reject(error);
    }
  );
}

const getLatestProducts = () => axiosClient.get("/products?populate=*");

const getServices = () => axiosClient.get("/services?populate=*");

const getCategories = () => axiosClient.get("/categories?populate=*");

const getBanners = () => axiosClient.get("/banners?populate=*");

const getNews = () => axiosClient.get("/news?populate=*");

const api = {
  getLatestProducts,
  getServices,
  getCategories,
  getBanners,
  getNews,
};

export default api;
