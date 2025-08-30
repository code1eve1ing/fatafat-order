// src/store/useShopStore.js
import { create } from 'zustand';

const useShopkeeperStore = create((set, get) => ({
    products: [],
    menuSections: [],
    addProduct: (product) => set({ products: [product, ...get().products] }),
    addSection: (section) => set({ menuSections: [section, ...get().menuSections] }),
    updateProduct: (product) => set({ products: get().products.map(p => p._id === product._id ? product : p) }),
    setProducts: (products) => set({ products }),
    setMenuSections: (menuSections) => set({ menuSections }),
    getProducts: (searchQuery, sectionId) => get().products.filter(
        (product) => sectionId ? product.section === sectionId : true
    ).filter(
        (product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.section.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    getMenuSections: () => get().menuSections,
}));

export default useShopkeeperStore;