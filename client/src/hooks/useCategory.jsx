import { useState, useEffect } from 'react';
import categoryService from '../services/categoryService';

// TODO: can use hook instead of service structure for product/order CRUD
export const useCategory = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load all categories
    const loadCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await categoryService.getCategories();
            setCategories(data);
        } catch (err) {
            setError(err.message || 'Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    // Create category
    const createCategory = async (categoryData) => {
        setLoading(true);
        setError(null);
        try {
            const newCategory = await categoryService.createCategory(categoryData);
            await loadCategories(); // Reload categories
            return newCategory;
        } catch (err) {
            setError(err.message || 'Failed to create category');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Update category
    const updateCategory = async (id, categoryData) => {
        setLoading(true);
        setError(null);
        try {
            const updatedCategory = await categoryService.updateCategory(id, categoryData);
            await loadCategories(); // Reload categories
            return updatedCategory;
        } catch (err) {
            setError(err.message || 'Failed to update category');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Delete category
    const deleteCategory = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await categoryService.deleteCategory(id);
            await loadCategories(); // Reload categories
        } catch (err) {
            setError(err.message || 'Failed to delete category');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Load categories on mount
    useEffect(() => {
        loadCategories();
    }, []);

    return {
        categories,
        loading,
        error,
        createCategory,
        updateCategory,
        deleteCategory,
        refreshCategories: loadCategories
    };
};