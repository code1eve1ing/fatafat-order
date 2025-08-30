// src/store/useShopStore.js
import moment from 'moment';
import { create } from 'zustand';

const useShopkeeperStore = create((set, get) => ({
    products: [],
    menuSections: [],
    orders: [],
    addProduct: (product) => set({ products: [product, ...get().products] }),
    addSection: (section) => set({ menuSections: [section, ...get().menuSections] }),
    addOrder: (order) => set({ orders: [order, ...get().orders] }),
    updateProduct: (product) => set({ products: get().products.map(p => p._id === product._id ? product : p) }),
    updateOrder: (order) => set({ orders: get().orders.map(o => o._id === order._id ? order : o) }),
    setProducts: (products) => set({ products }),
    setMenuSections: (menuSections) => set({ menuSections }),
    setOrders: (orders) => set({ orders }),
    getProducts: (searchQuery, sectionId) => get().products.filter(
        (product) => sectionId ? product.section === sectionId : true
    ).filter(
        (product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.section.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    getMenuSections: () => get().menuSections,
    getOrders: (searchQuery = '', status = null, sortBy = null) => {
        let filtered = [...get().orders];

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(o =>
                o.items.map(i => i.name).join(',').toLowerCase().includes(searchQuery.toLowerCase()) ||
                o?.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                o?.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                o?._id?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply status filter
        if (status) {
            filtered = filtered.filter(o => o.status === status);
        }
        // Apply sorting
        if (sortBy) {
            const [field, order] = sortBy.split('_');
            filtered.sort((a, b) => {
                let comparison = 0;
                if (field === 'date') {
                    const dateA = a.time ? moment(a.time, 'HH-mm').valueOf() : 0;
                    const dateB = b.time ? moment(b.time, 'HH-mm').valueOf() : 0;
                    comparison = dateA - dateB;
                } else if (field === 'amount') {
                    // Convert total to number before comparison
                    const totalA = typeof a.totalAmount === 'string' ? parseFloat(a.totalAmount) : a.totalAmount || 0;
                    const totalB = typeof b.totalAmount === 'string' ? parseFloat(b.totalAmount) : b.totalAmount || 0;
                    comparison = totalA - totalB;
                }
                return order === 'asc' ? comparison : -comparison;
            });
        }

        return filtered;
    },
}));

export default useShopkeeperStore;