import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with default config for auth service
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    },
});

// Create axios instance for products service
const productsApi = axios.create({
    baseURL: import.meta.env.VITE_PRODUCTS_API_URL || 'http://localhost:5001/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    },
});

// Common request interceptor function
const addAuthInterceptor = (apiInstance) => {
    apiInstance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
};

// Common response interceptor function
const addResponseInterceptor = (apiInstance) => {
    apiInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            const { response } = error;

            if (!response) {
                // Network error
                toast.error('Network error. Please check your connection.');
                return Promise.reject(error);
            }

            const { status, data } = response;

            switch (status) {
                case 400:
                    toast.error(data.message || 'Bad request');
                    break;
                case 401:
                    toast.error('Session expired. Please login again.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('userData');
                    window.location.href = '/login';
                    break;
                case 403:
                    toast.error('You are not authorized to perform this action');
                    break;
                case 404:
                    toast.error('Resource not found');
                    break;
                case 422:
                    // Validation errors
                    if (data.errors) {
                        Object.values(data.errors).forEach((errMsg) => {
                            toast.error(errMsg);
                        });
                    } else {
                        toast.error(data.message || 'Validation failed');
                    }
                    break;
                case 500:
                    toast.error('Server error. Please try again later.');
                    break;
                default:
                    toast.error(data.message || 'An unexpected error occurred');
            }

            return Promise.reject(error);
        }
    );
};

// Apply interceptors to both API instances
addAuthInterceptor(api);
addResponseInterceptor(api);
addAuthInterceptor(productsApi);
addResponseInterceptor(productsApi);

export default api;
export { productsApi };