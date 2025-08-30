import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Category from '../models/Category';
import { AuthRequest } from '../middleware/auth';

export const createCategory = async (req: AuthRequest, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name } = req.body;

        // Check if category already exists
        const existingCategory = await Category.findOne({ name: name.trim() });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category with this name already exists' });
        }

        const category = new Category({
            name: name.trim()
        });

        await category.save();

        res.status(201).json({
            message: 'Category created successfully',
            category: {
                id: category._id,
                name: category.name
            }
        });
    } catch (error: any) {
        console.error('Create category error:', error);
        res.status(500).json({ message: 'Server error while creating category' });
    }
};

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Category.find().select('_id name').sort({ name: 1 });

        res.json({
            categories,
            count: categories.length
        });
    } catch (error: any) {
        console.error('Get categories error:', error);
        res.status(500).json({ message: 'Server error while fetching categories' });
    }
};

export const getCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json({
            category: {
                id: category._id,
                name: category.name
            }
        });
    } catch (error: any) {
        console.error('Get category error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid category ID format' });
        }
        res.status(500).json({ message: 'Server error while fetching category' });
    }
};

export const updateCategory = async (req: AuthRequest, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { name } = req.body;

        // Check if category exists
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Check if another category already has this name
        const existingCategory = await Category.findOne({
            name: name.trim(),
            _id: { $ne: id }
        });

        if (existingCategory) {
            return res.status(400).json({ message: 'Another category with this name already exists' });
        }

        category.name = name.trim();
        await category.save();

        res.json({
            message: 'Category updated successfully',
            category: {
                id: category._id,
                name: category.name
            }
        });
    } catch (error: any) {
        console.error('Update category error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid category ID format' });
        }
        res.status(500).json({ message: 'Server error while updating category' });
    }
};

export const deleteCategory = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json({
            message: 'Category deleted successfully',
            category: {
                id: category._id,
                name: category.name
            }
        });
    } catch (error: any) {
        console.error('Delete category error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid category ID format' });
        }
        res.status(500).json({ message: 'Server error while deleting category' });
    }
};