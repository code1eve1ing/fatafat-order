import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    (set) => ({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,

        // Set user data after successful signup/login
        // TODO: create constants for role
        setAuthData: (data) => set({
            user: data.user || null,
            role: data.role,
            isAuthenticated: true,
            error: null
        }),

        setUser: (user) => set({ user }),

        // Set loading state
        setLoading: (loading) => set({ loading }),

        // Set error
        setError: (error) => set({ error }),

        // Clear auth data on logout
        clearAuth: () => set({
            user: null,
            isAuthenticated: false,
            error: null
        })
    })
);

export default useAuthStore;