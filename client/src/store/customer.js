import { create } from 'zustand';

const useCustomerStore = create((set, get) => ({
    // Shop data
    shop: null,
    products: [],
    menuSections: [],
    
    // Cart data
    cart: [],
    cartTotal: 0,
    
    // UI state
    loading: false,
    error: null,
    
    // Actions for shop data
    setShop: (shop) => set({ shop, error: null }),
    setProducts: (products) => set({ products }),
    setMenuSections: (menuSections) => set({ menuSections }),
    
    // Actions for loading and error states
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    
    // Cart actions
    addToCart: (product, quantity = 1) => {
        const cart = get().cart;
        const existingItem = cart.find(item => item._id === product._id);
        
        let newCart;
        if (existingItem) {
            newCart = cart.map(item =>
                item._id === product._id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            );
        } else {
            newCart = [...cart, { ...product, quantity }];
        }
        
        const cartTotal = newCart.reduce((total, item) => total + (item.price * item.quantity), 0);
        set({ cart: newCart, cartTotal });
    },
    
    removeFromCart: (productId) => {
        const cart = get().cart.filter(item => item._id !== productId);
        const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        set({ cart, cartTotal });
    },
    
    updateCartQuantity: (productId, quantity) => {
        if (quantity <= 0) {
            get().removeFromCart(productId);
            return;
        }
        
        const cart = get().cart.map(item =>
            item._id === productId ? { ...item, quantity } : item
        );
        const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        set({ cart, cartTotal });
    },
    
    clearCart: () => set({ cart: [], cartTotal: 0 }),
    
    // Getters
    getShop: () => get().shop,
    getProducts: (searchQuery = '', sectionId = null) => {
        const products = get().products;
        return products.filter(product => {
            const matchesSection = sectionId ? 
                (product.menu_section_id === sectionId || product.menu_section_id?._id === sectionId) : 
                true;
            const matchesSearch = searchQuery ? 
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchQuery.toLowerCase()) :
                true;
            return matchesSection && matchesSearch;
        });
    },
    
    getMenuSections: () => get().menuSections,
    getCart: () => get().cart,
    getCartTotal: () => get().cartTotal,
    getCartItemCount: () => get().cart.reduce((total, item) => total + item.quantity, 0),
    
    // Clear all data (useful for logout or shop change)
    clearCustomerData: () => set({
        shop: null,
        products: [],
        menuSections: [],
        cart: [],
        cartTotal: 0,
        error: null
    })
}));

export default useCustomerStore;
