import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

// Import Shop model from auth module - adjust path as needed
// Assuming the auth module is at the same level as products
import Shop from '../../auth/models/Shop';

// GET /api/shops/by-code/:shop_code
export const getShopByCode = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { shop_code } = req.params;

        if (!shop_code) {
            return res.status(400).json({ message: 'Shop code is required' });
        }

        const shop = await Shop.findOne({ shop_code }).populate('category_id');

        if (!shop) {
            return res.status(404).json({ message: 'Shop not found with the provided shop code' });
        }

        res.status(200).json({
            message: 'Shop found successfully',
            shop: {
                _id: shop._id,
                name: shop.name,
                shop_code: shop.shop_code,
                category_id: shop.category_id
            }
        });
    } catch (error: any) {
        console.error('Get shop by code error:', error);
        res.status(500).json({ message: 'Server error while fetching shop' });
    }
};

// GET /api/shops (optional - get all shops)
export const getAllShops = async (req: Request, res: Response) => {
    try {
        const shops = await Shop.find().populate('category_id');

        res.status(200).json({
            message: 'Shops retrieved successfully',
            count: shops.length,
            shops: shops.map(shop => ({
                _id: shop._id,
                name: shop.name,
                shop_code: shop.shop_code,
                category_id: shop.category_id
            }))
        });
    } catch (error: any) {
        console.error('Get all shops error:', error);
        res.status(500).json({ message: 'Server error while fetching shops' });
    }
};
