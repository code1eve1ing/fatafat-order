// src/store/useShopStore.js
import { getCurrentDate } from '@/lib/utils';
import { create } from 'zustand';

const useShopStore = create((set, get) => ({
    categories: [],
    shopDetails: null,
    loading: false,
    error: null,
    products: [],
    menuSections: [],
    orders: [],
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setShopDetails: (shopDetails) => set({ shopDetails }),
    getShopDetails: () => get().shopDetails,
    setCategories: (categories) => set({ categories }),
    getShopCategory: () => {
        const selectedCategory = localStorage.getItem('shopType')
        const category = get().categories.find((category) => category._id === selectedCategory);
        return category
    },
    addProduct: (product) => set({ products: [product, ...get().products] }),
    addSection: (section) => set({ menuSections: [section, ...get().menuSections] }),
    addOrder: (order) => set({ orders: [order, ...get().orders] }),
    addMenuSection: (section) => set({ menuSections: [section, ...get().menuSections] }),
    updateProduct: (product) => set({ products: get().products.map(p => p._id === product._id ? product : p) }),
    updateOrder: (order) => set({ orders: get().orders.map(o => o._id === order._id ? order : o) }),
    setProducts: (products) => set({ products }),
    setMenuSections: (menuSections) => set({ menuSections }),
    setOrders: (orders) => set({ orders }),
    getProducts: (searchQuery, sectionId) => get().products.filter(
        (product) => sectionId ? (product.section === sectionId || product.menu_section_id._id === sectionId) : true
    ).filter(
        (product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.section?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.menu_section_id?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    getMenuSections: () => get().menuSections,
    fetchOrdersByShop: async () => {
        const { getShopDetails } = get();
        const shopDetails = getShopDetails();
        
        if (!shopDetails?._id) {
            console.warn('No shop details found');
            return;
        }

        try {
            set({ loading: true, error: null });
            
            // Import shopkeeperService dynamically to avoid circular dependency
            const { default: shopkeeperService } = await import('@/services/shopkeeperService');
            const orders = await shopkeeperService.getOrders();
            
            set({ orders, loading: false });
        } catch (error) {
            console.error('Error fetching orders:', error);
            set({ error: error.message, loading: false });
        }
    },
    getOrders: (searchQuery = '', status = null, sortBy = null) => {
        let filtered = [...get().orders];

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(o =>
                o.items?.map(i => i.product_name || i.name).join(',').toLowerCase().includes(searchQuery.toLowerCase()) ||
                o?.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                o?.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                o?.order_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
                    const dateA = new Date(a.created_at).getTime();
                    const dateB = new Date(b.created_at).getTime();
                    comparison = dateA - dateB;
                } else if (field === 'amount') {
                    const totalA = a.total_amount || 0;
                    const totalB = b.total_amount || 0;
                    comparison = totalA - totalB;
                }
                return order === 'asc' ? comparison : -comparison;
            });
        }

        return filtered;
    },
}));

export default useShopStore;