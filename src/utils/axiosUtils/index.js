import axios from "axios";
import Cookies from "js-cookie";
import { fallbackLng } from "@/app/i18n/settings";

const client = axios.create({
  baseURL: process.env.URL,
  headers: {
    Accept: "application/json",
  },
  timeout: 60000, // Increased to 60 second timeout
});

// Dynamically set headers in interceptors
client.interceptors.request.use((config) => {
  const { localLanguage, formLanguage } = typeof window !== 'undefined'
    ? JSON.parse(window.localStorage.getItem("languageContext") || "{}")
    : {};

  // Determine the appropriate accept-language
  const isTranslateEndpoint = config.url?.includes(`/translation/admin`);
  const acceptLanguage =
    formLanguage && !isTranslateEndpoint
      ? formLanguage
      : localLanguage || fallbackLng;

  config.headers["accept-lang"] = acceptLanguage;

  // Set Authorization token
  const token = Cookies.get("uat");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Add response interceptor for better error handling
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle network errors gracefully with retry logic
    if (!error.response && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn('Network error, retrying...', error.message);
      
      // Retry once after a short delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return client(originalRequest);
    }
    
    // Handle timeout errors
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.error('Request timeout exceeded. Please check your network connection or try again later.');
    }
    
    return Promise.reject(error);
  }
);

const request = async ({ ...options }, router, headerOption) => {
  const onSuccess = (response) => response;
  const onError = (error) => {
    if (error?.response?.status == 401) {
      Cookies.remove("uat");
      Cookies.remove("ue");
      Cookies.remove("account");
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
      router && router.push("/auth/login");
    }
    return error;
  };
  try {
    if (headerOption) {
      options.headers = { ...options.headers, ...headerOption };
    }
    const response = await client(options);
    return onSuccess(response);
  } catch (error) {
    return onError(error);
  }
};

export default request;
