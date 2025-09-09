import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    (set) => ({
        user: null,
        token: null,
        shopId: null,
        isAuthenticated: false,
        loading: false,
        error: null,

        // Set user data after successful signup/login
        setAuthData: (data) => set({
            user: data.user || null,
            token: data.token || null,
            shopId: data.shopId || null,
            isAuthenticated: !!data.token,
            error: null
        }),

        // Set loading state
        setLoading: (loading) => set({ loading }),

        // Set error
        setError: (error) => set({ error }),

        // Clear auth data on logout
        clearAuth: () => set({
            user: null,
            token: null,
            shopId: null,
            isAuthenticated: false,
            error: null
        })
    })
);

export default useAuthStore;