import toast from 'react-hot-toast';
import api from './api';
import useAuthStore from '../store/auth';
import useShopStore from '@/store/shop';
import { SHOPKEEPER } from '@/lib/constants/user';

class AuthService {
    // Sign up with mobile/email
    async signup(userData) {
        const authStore = useAuthStore.getState();
        const shopStore = useShopStore.getState();
        try {
            authStore.setLoading(true);
            userData.email = userData.email || undefined;
            const response = await api.post('/auth/signup', userData);
            const { token, userId, shop } = response.data;

            // Store token and update auth state
            authStore.setAuthData({
                token,
                user: { _id: userId, mobile: userData.mobile, email: userData.email, name: userData.user_name },
                role: SHOPKEEPER // role until customer comes in scene :)
            });
            shopStore.setShopDetails(shop);
            localStorage.setItem('token', token);
            localStorage.removeItem('accountType');
            toast.success(response.data.message || 'Account created successfully!');
            return response.data;
        } catch (error) {
            authStore.setError(error.message || 'Failed to create account. Please try again later.');
            // Error is already handled by interceptor
            throw error;
        } finally {
            authStore.setLoading(false);
        }
    }

    // Verify OTP
    async verifyOTP(mobile, code) {
        try {
            const response = await api.post('/auth/verify', { mobile, code });
            const { token, user } = response.data;

            // Store token and user data
            localStorage.setItem('token', token);
            localStorage.setItem('userData', JSON.stringify(user));

            toast.success('Account verified successfully!');
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Login
    async login(credentials) {
        try {
            const authStore = useAuthStore.getState();
            const shopStore = useShopStore.getState();
            const response = await api.post('/auth/login', credentials);
            const { token, userId, shop, user } = response.data;

            // Store token and update auth state
            authStore.setAuthData({
                token,
                user: { _id: userId, mobile: user.mobile, email: user.email, name: user.name },
                role: SHOPKEEPER // role until customer comes in scene :)
            });
            shopStore.setShopDetails(shop);
            localStorage.setItem('token', token);
            localStorage.removeItem('accountType');
            toast.success(response.data.message || 'Login successful!');
            return response.data;

        } catch (error) {
            throw error;
        }
    }

    // Resend OTP
    async resendOTP(mobile) {
        try {
            const response = await api.post('/auth/resend-otp', { mobile });
            toast.success('OTP sent successfully!');
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Get current user profile
    async getCurrentUser() {
        const authStore = useAuthStore.getState();
        const shopStore = useShopStore.getState();
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await api.get('/auth/me');
                const { user, role, shop, customer } = response.data;

                authStore.setAuthData({
                    user,
                    role
                });
                shopStore.setShopDetails(shop);

                return response.data;
            }
            return null;
        } catch (error) {
            throw error;
        }
    }

    // Logout
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        localStorage.removeItem('accountType');
        localStorage.removeItem('shopType');
        toast.success('Logged out successfully');
    }

    // Check if user is authenticated
    isAuthenticated() {
        const token = localStorage.getItem('token');
        return !!token;
    }

    // Get stored user data
    getUserData() {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    }

    isAuthCompleted() {
        const token = localStorage.getItem('token');
        return !!token;
    }

    getAccountType() {
        const accountType = localStorage.getItem('accountType');
        return accountType;
    }


}

export default new AuthService();