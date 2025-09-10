import { useState, useEffect } from 'react';
import authService from '../services/authService';

const useAuth = () => {
    const [user, setUser] = useState(authService.getUserData());
    const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Check if token exists on app load
        setIsAuthenticated(authService.isAuthenticated());
        setUser(authService.getUserData());
    }, []);

    const signup = async (userData) => {
        setLoading(true);
        try {
            const result = await authService.signup(userData);
            setLoading(false);
            return result;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const getCurrentUser = async (callback) => {
        setLoading(true);
        try {
            const result = await authService.getCurrentUser();
            callback(result)
            // Propably we are navigating in callback, adding settimeout for no jumping in ui after full-screen loader hides
            setTimeout(() => {
                setLoading(false);
            }, 1000);
            return result;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    }

    const verifyOTP = async (mobile, code) => {
        setLoading(true);
        try {
            const result = await authService.verifyOTP(mobile, code);
            setUser(result.user);
            setIsAuthenticated(true);
            setLoading(false);
            return result;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const login = async (credentials) => {
        setLoading(true);
        try {
            const result = await authService.login(credentials);
            setUser(result.user);
            setIsAuthenticated(true);
            setLoading(false);
            return result;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const resendOTP = async (mobile) => {
        setLoading(true);
        try {
            const result = await authService.resendOTP(mobile);
            setLoading(false);
            return result;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    return {
        user,
        isAuthenticated,
        loading,
        signup,
        verifyOTP,
        login,
        resendOTP,
        logout,
        getCurrentUser
    };
};

export default useAuth;