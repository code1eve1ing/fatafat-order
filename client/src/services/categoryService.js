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

class CategoryService {
    // Get all categories
    async getCategories() {
        try {
            const response = await api.get('/categories', {
                headers: adminHeaders
            });
            return response.data.categories;
        } catch (error) {
            console.error('Get categories error:', error);
            throw error;
        }
    }

    // Get single category
    async getCategory(id) {
        try {
            const response = await api.get(`/categories/${id}`, {
                headers: adminHeaders
            });
            return response.data.category;
        } catch (error) {
            console.error('Get category error:', error);
            throw error;
        }
    }

    // Create category
    async createCategory(categoryData) {
        try {
            console.log(adminHeaders)
            const response = await api.post('/categories', categoryData, {
                headers: adminHeaders
            });
            toast.success('Category created successfully!');
            return response.data.category;
        } catch (error) {
            console.error('Create category error:', error);
            throw error;
        }
    }

    // Update category
    async updateCategory(id, categoryData) {
        try {
            const response = await api.put(`/categories/${id}`, categoryData, {
                headers: adminHeaders
            });
            toast.success('Category updated successfully!');
            return response.data.category;
        } catch (error) {
            console.error('Update category error:', error);
            throw error;
        }
    }

    // Delete category
    async deleteCategory(id) {
        try {
            await api.delete(`/categories/${id}`, {
                headers: adminHeaders
            });
            toast.success('Category deleted successfully!');
        } catch (error) {
            console.error('Delete category error:', error);
            throw error;
        }
    }
}

export default new CategoryService();