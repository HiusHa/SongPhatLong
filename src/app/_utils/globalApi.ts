import "dotenv/config";
import axios, { type AxiosResponse } from "axios";
import type { OrderData, OrderStatus } from "../types/Order";

const apiKey = process.env.NEXT_PUBLIC_API_KEY;

const apiURL = "https://songphatlong-admin.onrender.com/api";

const axiosClient = axios.create({
  baseURL: apiURL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
});

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  message: string;
}

// Only log in development environment
if (process.env.NODE_ENV !== "production") {
  axiosClient.interceptors.request.use((config) => {
    console.log("Request Config:", config);
    return config;
  });

  axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("Axios Error:", error.message);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received:", error.request);
      }
      return Promise.reject(error);
    }
  );
} else {
  // Minimal error logging in production
  axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error(
        "API Error:",
        error.response?.data?.error?.message || error.message
      );
      return Promise.reject(error);
    }
  );
}

const getLatestProducts = (): Promise<AxiosResponse> =>
  axiosClient.get("/products?populate=*");

const getServices = (): Promise<AxiosResponse> =>
  axiosClient.get("/services?populate=*");

const getCategories = (): Promise<AxiosResponse> =>
  axiosClient.get("/categories?populate=*");

const getBanners = (): Promise<AxiosResponse> =>
  axiosClient.get("/banners?populate=*");

const getNews = (): Promise<AxiosResponse> =>
  axiosClient.get("/news?populate=*");

const submitContactForm = (
  formData: ContactFormData
): Promise<AxiosResponse> => {
  const dataToSend = {
    data: {
      ...formData,
      phone: `+${formData.phone}`, // Ensure phone is sent as a string with "+" prefix
    },
  };
  console.log("Submitting form data:", JSON.stringify(dataToSend, null, 2));
  console.log("API URL:", `${apiURL}/contactforms`);
  return axiosClient
    .post("/contactforms", dataToSend)
    .then((response) => {
      console.log("API Response:", response.data);
      return response;
    })
    .catch((error) => {
      console.error("API Error:", error.response?.data || error.message);
      throw error;
    });
};

const submitOrder = (
  orderData: Omit<OrderData, "orderNumber" | "Stattus">
): Promise<AxiosResponse> => {
  const orderNumber = `SPL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const Stattus: OrderStatus = "pending";

  const dataToSend = {
    data: {
      firstName: orderData.firstName,
      lastName: orderData.lastName,
      address: orderData.address,
      phone: orderData.phone.toString(), // Ensure phone is sent as a string
      email: orderData.email,
      notes: orderData.notes || "",
      alternateAddress: orderData.alternateAddress || "",
      items: JSON.stringify(orderData.items), // Ensure items are sent as a JSON string
      subtotal: orderData.subtotal,
      total: orderData.total,
      Stattus: Stattus, // Using "Stattus" with a capital 'S' to match the schema
      orderNumber: orderNumber,
    },
  };

  console.log("Submitting order data:", JSON.stringify(dataToSend, null, 2));
  console.log("API URL:", `${apiURL}/orders`);

  return axiosClient
    .post("/orders", dataToSend)
    .then((response) => {
      console.log("Order submitted successfully:", response.data);
      return response;
    })
    .catch((error) => {
      console.error("API Error:", error.response?.data || error.message);
      console.error("Full error object:", JSON.stringify(error, null, 2));
      throw error;
    });
};

const api = {
  getLatestProducts,
  getServices,
  getCategories,
  getBanners,
  getNews,
  submitContactForm,
  submitOrder,
};

export default api;
