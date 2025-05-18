import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";

// Environment configuration
const prod: boolean = false;
const baseUrl: string = prod ? "https://api.the.com" : "http://localhost:5000";

// Cookie management
const COOKIE_JWT = "jwt";
const COOKIE_EXPIRY_DAYS = 30;

// Header keys
const HEADER_AUTH_TOKEN = "x-auth-token";

/**
 * Creates and configures an axios instance with proper interceptors
 */
const createConfiguredAxiosInstance = (
  baseURL: string = baseUrl
): AxiosInstance => {
  const instance = axios.create({ baseURL });

  // Request interceptor
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      if (typeof window !== "undefined") {
        // Prefer JWT token from localStorage if present
        const bearerToken = localStorage.getItem("token");
        if (bearerToken) {
          config.headers.set("Authorization", `Bearer ${bearerToken}`);
        }

        // Also set custom token from cookies if available
        const jwt: string | undefined = Cookies.get(COOKIE_JWT);
        if (jwt) {
          config.headers.set(HEADER_AUTH_TOKEN, jwt);
        }
      }
      return config;
    },
    (error: AxiosError): Promise<AxiosError> => Promise.reject(error)
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response,
    (error: AxiosError): Promise<AxiosError> => {
      if (error.response) {
        console.log("Error status:", error.response.status);

        const errorData = error.response.data as { error?: string } | undefined;
        const errorMessage: string = errorData?.error || "An error occurred";

        if (error.response.status === 403) {
          alert(errorMessage || "Access denied");

          if (
            errorMessage.includes("inactive") ||
            errorMessage.includes("unauthorized")
          ) {
            Cookies.remove(COOKIE_JWT);
            window.location.href = "/login";
          }
        }
      } else if (error.request) {
        alert(
          "No response received from server. Please check your connection."
        );
      } else {
        alert(`Error in request setup: ${error.message}`);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Create the default axios instance
const axiosInstance = createConfiguredAxiosInstance();

// Create specialized instances for different API areas
export const axiosInstanceCourse = createConfiguredAxiosInstance();
export const axiosInstanceDiscussion = createConfiguredAxiosInstance();
export const axiosInstanceTenantManagment = createConfiguredAxiosInstance();
export const axiosInstanceAI = createConfiguredAxiosInstance();

export default axiosInstance;
