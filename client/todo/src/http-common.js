import axios from "axios";

// Function to get the bearer token (you can modify this to fit your authentication logic)
const getBearerToken = () => {
  // Example: Retrieve token from local storage or another secure location
  return localStorage.getItem("token");
};

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-type": "application/json",
  },
});

// Add a request interceptor to include the bearer token if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = JSON.parse(getBearerToken())
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle non-JSON responses
axiosInstance.interceptors.response.use(
  (response) => {
    // If the response is successful and contains JSON, return it
    return response;
  },
  (error) => {
    // Check if the response is not in JSON format
    if (
      error.response &&
      error.response.headers["content-type"] &&
      !error.response.headers["content-type"].includes("application/json")
    ) {
      // Handle non-JSON error response (e.g., plain text or HTML error page)
      console.error("Error:", error.response.status, error.response.statusText);
      return Promise.reject(new Error("A non-JSON error response was received"));
    }

    // For JSON responses, simply return the error
    return Promise.reject(error);
  }
);

export default axiosInstance;
