import { FREE_TRIAL } from "@/lib/constants/user";
import { productsApi, ordersApi } from './api';
import useShopStore from '@/store/shop';

class ShopkeeperService {

    async addProduct(productData, callback) {
        const isFreeTrial = localStorage.getItem("accountType") === FREE_TRIAL;
        if (isFreeTrial) {
            const savedProducts = localStorage.getItem("savedProducts") || "[]";
            const parsedProducts = JSON.parse(savedProducts);
            const newProduct = { _id: String(Date.now()), ...productData };
            parsedProducts.unshift(newProduct);
            localStorage.setItem("savedProducts", JSON.stringify(parsedProducts));
            callback(newProduct)
        } else {
            try {
                const shopStore = useShopStore.getState();
                const shopId = shopStore.shopDetails?._id;

                const response = await productsApi.post('/products', {
                    name: productData.name,
                    shop_id: shopId,
                    menu_section_id: productData.section,
                    price: productData.price,
                    description: productData.description
                });

                callback(response.data.product);
            } catch (error) {
                throw error;
            }
        }
    }

    async updateProduct(productData, callback) {
        const isFreeTrial = localStorage.getItem("accountType") === FREE_TRIAL;
        if (isFreeTrial) {
            const savedProducts = localStorage.getItem("savedProducts") || "[]";
            let parsedProducts = JSON.parse(savedProducts);
            parsedProducts = parsedProducts.map(p => p._id === productData._id ? productData : p)
            localStorage.setItem("savedProducts", JSON.stringify(parsedProducts));
            callback(productData)
        } else {
            try {
                const shopStore = useShopStore.getState();
                const shopId = shopStore.shopDetails?._id;

                const response = await productsApi.put(`/products/${productData._id}`, {
                    name: productData.name,
                    shop_id: shopId,
                    menu_section_id: productData.section,
                    price: productData.price,
                    description: productData.description
                });

                callback(response.data.product);
            } catch (error) {
                throw error;
            }
        }
    }

    async updateOrder(orderData, callback) {
        const isFreeTrial = localStorage.getItem("accountType") === FREE_TRIAL;
        if (isFreeTrial) {
            const savedOrders = localStorage.getItem("savedOrders") || "[]";
            let parsedOrders = JSON.parse(savedOrders);
            parsedOrders = parsedOrders.map(p => p._id === orderData._id ? orderData : p)
            localStorage.setItem("savedOrders", JSON.stringify(parsedOrders));
            callback(orderData)
        } else {
            try {
                const orderId = orderData._id;
                console.log(orderData);
                const response = await ordersApi.patch(`/orders/${orderId}/status`, {
                    status: orderData.status
                });
                callback(response.data.data);
            } catch (error) {
                console.error('Error updating order:', error);
                throw error;
            }
        }
    }

    async deleteProduct(productId, callback) {
        const isFreeTrial = localStorage.getItem("accountType") === FREE_TRIAL;
        if (isFreeTrial) {
            const savedProducts = localStorage.getItem("savedProducts") || "[]";
            let parsedProducts = JSON.parse(savedProducts);
            parsedProducts = parsedProducts.filter(p => p._id !== productId)
            localStorage.setItem("savedProducts", JSON.stringify(parsedProducts));
            callback()
        } else {
            try {
                await productsApi.delete(`/products/${productId}`);
                callback();
            } catch (error) {
                throw error;
            }
        }
    }

    async getProducts() {
        const isFreeTrial = localStorage.getItem("accountType") === FREE_TRIAL;
        if (isFreeTrial) {
            const savedProducts = localStorage.getItem("savedProducts") || "[]";
            return JSON.parse(savedProducts);
        } else {
            try {
                const shopStore = useShopStore.getState();
                const shopId = shopStore.shopDetails?._id;
                const response = await productsApi.get(`/products/shop/${shopId}`);
                shopStore.setProducts(response.data.products);
                return response.data.products;
            } catch (error) {
                throw error;
            }
        }
    }


    // Only for food-store
    async saveSection(sectionData, callback) {
        console.log('sectionData', sectionData)
        const isFreeTrial = localStorage.getItem("accountType") === FREE_TRIAL;
        if (isFreeTrial) {
            const savedSections = localStorage.getItem("savedSections") || "[]";
            const parsedSections = JSON.parse(savedSections);
            const newSection = { _id: String(Date.now()), order: parsedSections.length + 1, ...sectionData };
            parsedSections.unshift(newSection);
            localStorage.setItem("savedSections", JSON.stringify(parsedSections));
            // callback(newSection)
        } else {
            try {
                const shopStore = useShopStore.getState();
                const shopId = shopStore.shopDetails?._id;

                const response = await productsApi.post('/menu-sections', {
                    name: sectionData.name,
                    shop_id: shopId
                });
                shopStore.addMenuSection(response.data.menuSection);
            } catch (error) {
                throw error;
            }
        }
    }

    // Only for food-store
    async getSections() {
        const isFreeTrial = localStorage.getItem("accountType") === FREE_TRIAL;
        if (isFreeTrial) {
            const savedSections = localStorage.getItem("savedSections") || "[]";
            return JSON.parse(savedSections).sort((a, b) => a.order - b.order);
        } else {
            try {
                const shopStore = useShopStore.getState();
                const shopId = shopStore.shopDetails?._id;

                const response = await productsApi.get(`/menu-sections/shop/${shopId}`);
                shopStore.setMenuSections(response.data.menuSections);
                return response.data.menuSections;
            } catch (error) {
                throw error;
            }
        }
    }

    async getOrders() {
        const isFreeTrial = localStorage.getItem("accountType") === FREE_TRIAL;
        if (isFreeTrial) {
            const savedOrders = localStorage.getItem("savedOrders") || "[]";
            return JSON.parse(savedOrders);
        } else {
            try {
                const shopStore = useShopStore.getState();
                const shopId = shopStore.shopDetails?._id;

                if (!shopId) {
                    console.warn('No shop ID found');
                    return [];
                }

                const response = await ordersApi.get(`/orders/shop/${shopId}`);
                return response.data.data.orders || [];
            } catch (error) {
                console.error('Error fetching orders:', error);
                return [];
            }
        }
    }

    saveOrder(orderData, callback) {
        const isFreeTrial = localStorage.getItem("accountType") === FREE_TRIAL;
        if (isFreeTrial) {
            const savedOrders = localStorage.getItem("savedOrders") || "[]";
            const parsedOrders = JSON.parse(savedOrders);
            const newOrder = { _id: '#O-' + String(Date.now()), ...orderData };
            parsedOrders.unshift(newOrder);
            localStorage.setItem("savedOrders", JSON.stringify(parsedOrders));
            callback(newOrder)
        } else {
            // TODO: save into api 
        }
    }
}

export default new ShopkeeperService();
