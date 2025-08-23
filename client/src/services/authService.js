import toast from 'react-hot-toast';
import api from './api';

class AuthService {
    // Sign up with mobile/email
    async signup(userData) {
        try {
            const response = await api.post('/auth/signup', userData);
            const { token } = response.data;
            // Store token and user data
            localStorage.setItem('token', token);
            toast.success('Account created successfully. Please verify your OTP.');
            return response.data;
        } catch (error) {
            // Error is already handled by interceptor
            throw error;
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
            const response = await api.post('/auth/login', credentials);
            const { token, user } = response.data;

            // Store token and user data
            localStorage.setItem('token', token);
            localStorage.setItem('userData', JSON.stringify(user));

            toast.success('Login successful!');
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
        try {
            const response = await api.get('/auth/me');
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Logout
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
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
}

export default new AuthService();