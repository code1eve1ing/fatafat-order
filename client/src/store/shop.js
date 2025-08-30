// src/store/useShopStore.js
import { create } from 'zustand';

const useShopStore = create((set, get) => ({
    categories: [],
    setCategories: (categories) => set({ categories }),
    getShopCategory: () => {
        const selectedCategory = localStorage.getItem('shopType')
        const category = get().categories.find((category) => category._id === selectedCategory);
        return category
    }
}));

export default useShopStore;