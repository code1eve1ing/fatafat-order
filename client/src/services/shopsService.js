import { productsApi } from './api';

class ShopsService {
    constructor() {
        this.api = productsApi;
    }

    // Get shops with pagination and filters
    async getShops(params = {}) {
        try {
            const queryParams = new URLSearchParams();

            if (params.page) queryParams.append('page', params.page);
            if (params.limit) queryParams.append('limit', params.limit);
            if (params.name) queryParams.append('name', params.name);
            if (params.category_id) queryParams.append('category_id', params.category_id);
            if (params.district_id) queryParams.append('district_id', params.district_id);
            if (params.city_id) queryParams.append('city_id', params.city_id);
            if (params.state_id) queryParams.append('state_id', params.state_id);

            const response = await this.api.get(`/shops?${queryParams.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching shops:', error);
            throw error;
        }
    }

    // Get shop by code or ID
    async getShopByCode(shopCode) {
        try {
            const response = await this.api.get(`/shops/by-code/${shopCode}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching shop by code:', error);
            throw error;
        }
    }
}

export default new ShopsService();
