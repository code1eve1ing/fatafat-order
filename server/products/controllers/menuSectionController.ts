import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import MenuSection from '../models/MenuSection';
import { AuthRequest } from '../middleware/auth';

// Create a new menu section
export const createMenuSection = async (req: AuthRequest, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, shop_id } = req.body;

        // Check if menu section already exists for this shop
        const existingSection = await MenuSection.findOne({ name, shop_id });
        if (existingSection) {
            return res.status(400).json({ message: 'Menu section with this name already exists for this shop' });
        }

        const menuSection = new MenuSection({
            name,
            shop_id
        });

        await menuSection.save();
        res.status(201).json({ message: 'Menu section created successfully', menuSection });
    } catch (error) {
        console.error('Error creating menu section:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all menu sections for a shop
export const getMenuSectionsByShop = async (req: Request, res: Response) => {
    try {
        const { shopId } = req.params;
        
        const menuSections = await MenuSection.find({ shop_id: shopId }).sort({ createdAt: -1 });
        res.json({ menuSections });
    } catch (error) {
        console.error('Error fetching menu sections:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get a single menu section by ID
export const getMenuSectionById = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const menuSection = await MenuSection.findById(id);

        if (!menuSection) {
            return res.status(404).json({ message: 'Menu section not found' });
        }

        res.json({ menuSection });
    } catch (error) {
        console.error('Error fetching menu section:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a menu section
export const updateMenuSection = async (req: AuthRequest, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { name, shop_id } = req.body;

        // Check if another menu section with the same name exists for this shop
        const existingSection = await MenuSection.findOne({ 
            name, 
            shop_id, 
            _id: { $ne: id } 
        });
        
        if (existingSection) {
            return res.status(400).json({ message: 'Menu section with this name already exists for this shop' });
        }

        const menuSection = await MenuSection.findByIdAndUpdate(
            id,
            { name, shop_id },
            { new: true, runValidators: true }
        );

        if (!menuSection) {
            return res.status(404).json({ message: 'Menu section not found' });
        }

        res.json({ message: 'Menu section updated successfully', menuSection });
    } catch (error) {
        console.error('Error updating menu section:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a menu section
export const deleteMenuSection = async (req: AuthRequest, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const menuSection = await MenuSection.findByIdAndDelete(id);

        if (!menuSection) {
            return res.status(404).json({ message: 'Menu section not found' });
        }

        res.json({ message: 'Menu section deleted successfully' });
    } catch (error) {
        console.error('Error deleting menu section:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
