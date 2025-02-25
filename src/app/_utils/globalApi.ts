import "dotenv/config";
import axios, { type AxiosResponse } from "axios";

const apiKey = process.env.NEXT_PUBLIC_API_KEY;

const apiURL = "https://songphatlong-admin.onrender.com/api";

const axiosClient = axios.create({
  baseURL: apiURL,
  headers: {
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
      phone: Number(formData.phone), // Ensure phone is sent as a number
    },
  };
  console.log("Submitting form data:", JSON.stringify(dataToSend, null, 2));
  console.log("API URL:", `${apiURL}/contactforms`);
  console.log("API Key:", apiKey); // Be cautious with logging sensitive information
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

const api = {
  getLatestProducts,
  getServices,
  getCategories,
  getBanners,
  getNews,
  submitContactForm, // Use the real function always
};

export default api;
