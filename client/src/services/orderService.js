const API_BASE_URL = 'http://localhost:5002/api/orders';

class OrderService {
    async sendOTP(identifier, type) {
        try {
            const response = await fetch(`${API_BASE_URL}/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ identifier, type })
            });

            const data = await response.json();
            return { success: response.ok, data };
        } catch (error) {
            console.error('Error sending OTP:', error);
            return { success: false, error: error.message };
        }
    }

    async verifyOTP(identifier, otp, type) {
        try {
            const response = await fetch(`${API_BASE_URL}/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ identifier, otp, type })
            });

            const data = await response.json();
            return { success: response.ok, data };
        } catch (error) {
            console.error('Error verifying OTP:', error);
            return { success: false, error: error.message };
        }
    }

    async createOrder(orderData) {
        try {
            const response = await fetch(`${API_BASE_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();
            return { success: response.ok, data };
        } catch (error) {
            console.error('Error creating order:', error);
            return { success: false, error: error.message };
        }
    }

    async getOrder(orderId) {
        try {
            const response = await fetch(`${API_BASE_URL}/${orderId}`);
            const data = await response.json();
            return { success: response.ok, data };
        } catch (error) {
            console.error('Error fetching order:', error);
            return { success: false, error: error.message };
        }
    }

    async getOrdersByShop(shopId, filters = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (filters.status) queryParams.append('status', filters.status);
            if (filters.page) queryParams.append('page', filters.page);
            if (filters.limit) queryParams.append('limit', filters.limit);

            const url = `${API_BASE_URL}/shop/${shopId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
            const response = await fetch(url);
            const data = await response.json();
            return { success: response.ok, data };
        } catch (error) {
            console.error('Error fetching orders:', error);
            return { success: false, error: error.message };
        }
    }

    async updateOrderStatus(orderId, status) {
        try {
            const response = await fetch(`${API_BASE_URL}/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status })
            });

            const data = await response.json();
            return { success: response.ok, data };
        } catch (error) {
            console.error('Error updating order status:', error);
            return { success: false, error: error.message };
        }
    }
}

export default new OrderService();
