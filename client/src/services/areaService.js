import api from './api';
import toast from 'react-hot-toast';

const adminSecret = localStorage.getItem('adminSecret');
const adminEmail = localStorage.getItem('adminEmail');
const adminPassword = localStorage.getItem('adminPassword');
const adminHeaders = {
    'Admin_secret': adminSecret,
    'Admin_email': adminEmail,
    'Admin_password': adminPassword
}

class AreaService {
    // State methods
    async getStates() {
        try {
            const response = await api.get('/areas/states', {
                headers: adminHeaders
            });
            return response.data.states;
        } catch (error) {
            console.error('Get states error:', error);
            throw error;
        }
    }

    async getState(id) {
        try {
            const response = await api.get(`/areas/states/${id}`, {
                headers: adminHeaders
            });
            return response.data.state;
        } catch (error) {
            console.error('Get state error:', error);
            throw error;
        }
    }

    async createState(stateData) {
        try {
            const response = await api.post('/areas/states', stateData, {
                headers: adminHeaders
            });
            toast.success('State created successfully!');
            return response.data.state;
        } catch (error) {
            console.error('Create state error:', error);
            throw error;
        }
    }

    async updateState(id, stateData) {
        try {
            const response = await api.put(`/areas/states/${id}`, stateData, {
                headers: adminHeaders
            });
            toast.success('State updated successfully!');
            return response.data.state;
        } catch (error) {
            console.error('Update state error:', error);
            throw error;
        }
    }

    async deleteState(id) {
        try {
            await api.delete(`/areas/states/${id}`, {
                headers: adminHeaders
            });
            toast.success('State deleted successfully!');
        } catch (error) {
            console.error('Delete state error:', error);
            throw error;
        }
    }

    // City methods
    async getCities(stateId = null) {
        try {
            const url = stateId ? `/areas/cities?stateId=${stateId}` : '/areas/cities';
            const response = await api.get(url, {
                headers: adminHeaders
            });
            return response.data.cities;
        } catch (error) {
            console.error('Get cities error:', error);
            throw error;
        }
    }

    async getCity(id) {
        try {
            const response = await api.get(`/areas/cities/${id}`, {
                headers: adminHeaders
            });
            return response.data.city;
        } catch (error) {
            console.error('Get city error:', error);
            throw error;
        }
    }

    async createCity(cityData) {
        try {
            const response = await api.post('/areas/cities', cityData, {
                headers: adminHeaders
            });
            toast.success('City created successfully!');
            return response.data.city;
        } catch (error) {
            console.error('Create city error:', error);
            throw error;
        }
    }

    async updateCity(id, cityData) {
        try {
            const response = await api.put(`/areas/cities/${id}`, cityData, {
                headers: adminHeaders
            });
            toast.success('City updated successfully!');
            return response.data.city;
        } catch (error) {
            console.error('Update city error:', error);
            throw error;
        }
    }

    async deleteCity(id) {
        try {
            await api.delete(`/areas/cities/${id}`, {
                headers: adminHeaders
            });
            toast.success('City deleted successfully!');
        } catch (error) {
            console.error('Delete city error:', error);
            throw error;
        }
    }

    // District methods
    async getDistricts(cityId = null) {
        try {
            const url = cityId ? `/areas/districts?cityId=${cityId}` : '/areas/districts';
            const response = await api.get(url, {
                headers: adminHeaders
            });
            return response.data.districts;
        } catch (error) {
            console.error('Get districts error:', error);
            throw error;
        }
    }

    async getDistrict(id) {
        try {
            const response = await api.get(`/areas/districts/${id}`, {
                headers: adminHeaders
            });
            return response.data.district;
        } catch (error) {
            console.error('Get district error:', error);
            throw error;
        }
    }

    async createDistrict(districtData) {
        try {
            const response = await api.post('/areas/districts', districtData, {
                headers: adminHeaders
            });
            toast.success('District created successfully!');
            return response.data.district;
        } catch (error) {
            console.error('Create district error:', error);
            throw error;
        }
    }

    async updateDistrict(id, districtData) {
        try {
            const response = await api.put(`/areas/districts/${id}`, districtData, {
                headers: adminHeaders
            });
            toast.success('District updated successfully!');
            return response.data.district;
        } catch (error) {
            console.error('Update district error:', error);
            throw error;
        }
    }

    async deleteDistrict(id) {
        try {
            await api.delete(`/areas/districts/${id}`, {
                headers: adminHeaders
            });
            toast.success('District deleted successfully!');
        } catch (error) {
            console.error('Delete district error:', error);
            throw error;
        }
    }

    // Get all areas with hierarchy
    async getAllAreas() {
        try {
            const response = await api.get('/areas/all', {
                headers: adminHeaders
            });
            return response.data.areas;
        } catch (error) {
            console.error('Get all areas error:', error);
            throw error;
        }
    }
}

export default new AreaService();
