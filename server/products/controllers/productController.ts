import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Product from '../models/Product';
import MenuSection from '../models/MenuSection';
import { AuthRequest } from '../middleware/auth';

// Create a new product
export const createProduct = async (req: AuthRequest, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, shop_id, menu_section_id, price, description } = req.body;

        // Verify that the menu section exists and belongs to the shop
        const menuSection = await MenuSection.findOne({ _id: menu_section_id, shop_id });
        if (!menuSection) {
            return res.status(400).json({ message: 'Invalid menu section for this shop' });
        }

        const product = new Product({
            name,
            shop_id,
            menu_section_id,
            price,
            description
        });

        await product.save();
        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all products for a shop
export const getProductsByShop = async (req: Request, res: Response) => {
    try {
        const { shopId } = req.params;
        
        const products = await Product.find({ shop_id: shopId })
            .populate('menu_section_id', 'name')
            .sort({ createdAt: -1 });
        
        res.json({ products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get products by menu section
export const getProductsByMenuSection = async (req: Request, res: Response) => {
    try {
        const { menuSectionId } = req.params;
        
        const products = await Product.find({ menu_section_id: menuSectionId })
            .populate('menu_section_id', 'name')
            .sort({ createdAt: -1 });
        
        res.json({ products });
    } catch (error) {
        console.error('Error fetching products by menu section:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get a single product by ID
export const getProductById = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const product = await Product.findById(id).populate('menu_section_id', 'name');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ product });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a product
export const updateProduct = async (req: AuthRequest, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { name, shop_id, menu_section_id, price, description } = req.body;

        // Verify that the menu section exists and belongs to the shop
        const menuSection = await MenuSection.findOne({ _id: menu_section_id, shop_id });
        if (!menuSection) {
            return res.status(400).json({ message: 'Invalid menu section for this shop' });
        }

        const product = await Product.findByIdAndUpdate(
            id,
            { name, shop_id, menu_section_id, price, description },
            { new: true, runValidators: true }
        ).populate('menu_section_id', 'name');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a product
export const deleteProduct = async (req: AuthRequest, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
