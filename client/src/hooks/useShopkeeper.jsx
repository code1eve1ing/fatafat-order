import { useState, useEffect } from 'react';
import shopkeeperService from '../services/shopkeeperService';

const useShopkeeper = () => {
    const [products, setProducts] = useState([]);
    const [sections, setSections] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadProducts = async () => {
        try {
            const productList = await shopkeeperService.getProducts();
            setProducts(productList);
        } catch (error) {
            console.error('Error loading products:', error);
        }
    };

    const loadSections = async () => {
        try {
            const sectionList = await shopkeeperService.getSections();
            setSections(sectionList);
        } catch (error) {
            console.error('Error loading sections:', error);
        }
    };

    const loadOrders = () => {
        try {
            const orderList = shopkeeperService.getOrders();
            setOrders(orderList);
        } catch (error) {
            console.error('Error loading orders:', error);
        }
    };

    const addProduct = async (productData) => {
        setLoading(true);
        try {
            await shopkeeperService.addProduct(productData, (newProduct) => {
                setProducts(prev => [newProduct, ...prev]);
            });
            setLoading(false);
            return true;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const updateProduct = async (productData) => {
        setLoading(true);
        try {
            await shopkeeperService.updateProduct(productData, (updatedProduct) => {
                setProducts(prev => prev.map(p => p._id === updatedProduct._id ? updatedProduct : p));
            });
            setLoading(false);
            return true;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const deleteProduct = async (productId) => {
        setLoading(true);
        try {
            await shopkeeperService.deleteProduct(productId, () => {
                setProducts(prev => prev.filter(p => p._id !== productId));
            });
            setLoading(false);
            return true;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const addSection = async (sectionData) => {
        setLoading(true);
        try {
            await shopkeeperService.saveSection(sectionData);
            setLoading(false);
            return true;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const addOrder = async (orderData) => {
        setLoading(true);
        try {
            await shopkeeperService.saveOrder(orderData, (newOrder) => {
                setOrders(prev => [newOrder, ...prev]);
            });
            setLoading(false);
            return true;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const updateOrder = async (orderData) => {
        setLoading(true);
        try {
            await shopkeeperService.updateOrder(orderData, (updatedOrder) => {
                setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
            });
            setLoading(false);
            return true;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const refreshData = async () => {
        await loadProducts();
        await loadSections();
        loadOrders();
    };

    return {
        products,
        sections,
        orders,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        addSection,
        addOrder,
        updateOrder,
        refreshData,
        loadProducts,
        loadSections,
        loadOrders
    };
};

export default useShopkeeper;
