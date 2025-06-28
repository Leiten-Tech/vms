import axios from "axios";

// Create an Axios instance with base settings
let axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 180000,
});

// Add request interceptor to include the `Authorization` header
axiosInstance.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem("data_AuthToken");
    if (authToken) {
      config.headers["Authorization"] = `Bearer ${authToken.replaceAll(
        '"',
        ""
      )}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

// Optional: Get default Axios adapter for advanced testing scenarios
export const getDefaultAdapter = () => axios.defaults.adapter;
