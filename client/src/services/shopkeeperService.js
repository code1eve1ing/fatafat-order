import { FREE_TRIAL } from "@/lib/constants/user";

class ShopkeeperService {

    addProduct(productData, callback) {
        const isFreeTrial = localStorage.getItem("accountType") === FREE_TRIAL;
        if (isFreeTrial) {
            const savedProducts = localStorage.getItem("savedProducts") || "[]";
            const parsedProducts = JSON.parse(savedProducts);
            const newProduct = { _id: String(Date.now()), ...productData };
            parsedProducts.unshift(newProduct);
            localStorage.setItem("savedProducts", JSON.stringify(parsedProducts));
            callback(newProduct)
        } else {
            // TODO: save into api 
        }
    }

    updateProduct(productData, callback) {
        const isFreeTrial = localStorage.getItem("accountType") === FREE_TRIAL;
        if (isFreeTrial) {
            const savedProducts = localStorage.getItem("savedProducts") || "[]";
            let parsedProducts = JSON.parse(savedProducts);
            parsedProducts = parsedProducts.map(p => p._id === productData._id ? productData : p)
            localStorage.setItem("savedProducts", JSON.stringify(parsedProducts));
            callback(productData)
        } else {
            // TODO: save into api 
        }
    }

    updateOrder(orderData, callback) {
        const isFreeTrial = localStorage.getItem("accountType") === FREE_TRIAL;
        if (isFreeTrial) {
            const savedOrders = localStorage.getItem("savedOrders") || "[]";
            let parsedOrders = JSON.parse(savedOrders);
            parsedOrders = parsedOrders.map(p => p._id === orderData._id ? orderData : p)
            localStorage.setItem("savedOrders", JSON.stringify(parsedOrders));
            callback(orderData)
        } else {
            // TODO: save into api 
        }
    }

    deleteProduct(productId, callback) {
        const isFreeTrial = localStorage.getItem("accountType") === FREE_TRIAL;
        if (isFreeTrial) {
            const savedProducts = localStorage.getItem("savedProducts") || "[]";
            let parsedProducts = JSON.parse(savedProducts);
            parsedProducts = parsedProducts.filter(p => p._id !== productId)
            localStorage.setItem("savedProducts", JSON.stringify(parsedProducts));
            callback()
        } else {
            // TODO: save into api 
        }
    }

    getProducts() {
        const isFreeTrial = localStorage.getItem("accountType") === FREE_TRIAL;
        if (isFreeTrial) {
            const savedProducts = localStorage.getItem("savedProducts") || "[]";
            return JSON.parse(savedProducts);
        } else {
            // TODO: get from api 
            return [];
        }
    }


    // Only for food-store
    saveSection(sectionData, callback) {
        console.log('sectionData', sectionData)
        const isFreeTrial = localStorage.getItem("accountType") === FREE_TRIAL;
        if (isFreeTrial) {
            const savedSections = localStorage.getItem("savedSections") || "[]";
            const parsedSections = JSON.parse(savedSections);
            const newSection = { _id: String(Date.now()), order: parsedSections.length + 1, ...sectionData };
            parsedSections.unshift(newSection);
            localStorage.setItem("savedSections", JSON.stringify(parsedSections));
            callback(newSection)
        } else {
            // TODO: save into api 
        }
    }

    // Only for food-store
    getSections() {
        const isFreeTrial = localStorage.getItem("accountType") === FREE_TRIAL;
        if (isFreeTrial) {
            const savedSections = localStorage.getItem("savedSections") || "[]";
            return JSON.parse(savedSections).sort((a, b) => a.order - b.order);
        } else {
            // TODO: get from api 
            return [];
        }
    }

    getOrders() {
        const isFreeTrial = localStorage.getItem("accountType") === FREE_TRIAL;
        if (isFreeTrial) {
            const savedOrders = localStorage.getItem("savedOrders") || "[]";
            return JSON.parse(savedOrders);
        } else {
            // TODO: get from api 
            return [];
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
