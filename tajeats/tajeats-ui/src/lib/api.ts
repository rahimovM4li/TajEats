import axios, { type AxiosInstance, AxiosError } from 'axios';
import { getOrCreateSessionId } from './sessionManager';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor - Add session ID header
apiClient.interceptors.request.use(
  (config) => {
    const sessionId = getOrCreateSessionId();
    config.headers['X-Session-ID'] = sessionId;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const data: any = error.response.data;

      switch (status) {
        case 401:
          console.error('Unauthorized - Please login');
          // TODO: Redirect to login when auth is implemented
          break;
        case 403:
          console.error('Forbidden - Access denied');
          break;
        case 404:
          console.error('Resource not found:', data.message || error.message);
          break;
        case 500:
          console.error('Server error:', data.message || error.message);
          break;
        default:
          console.error('API Error:', data.message || error.message);
      }
    } else if (error.request) {
      console.error('Network error - No response from server');
    } else {
      console.error('Request error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
export { API_BASE_URL };
