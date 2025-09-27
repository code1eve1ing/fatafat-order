import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { validateShopCode } from '../services/grpcClient';

// GET /api/shops/by-code/:shop_code - supports both shop code (SHOP-XXXX) and shop ID
export const getShopByCode = async (req: Request, res: Response) => {
    try {
        console.log("REQUEST", req)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { shop_code } = req.params;

        if (!shop_code) {
            return res.status(400).json({ message: 'Shop code or ID is required' });
        }

        // Check if the parameter is a MongoDB ObjectId (24 hex characters) or shop code (SHOP-XXXX format)
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(shop_code);
        const isShopCode = /^SHOP-\d{4}$/.test(shop_code);

        if (!isObjectId && !isShopCode) {
            return res.status(400).json({
                message: 'Invalid format. Provide either a valid shop code (SHOP-XXXX) or shop ID'
            });
        }

        // Use gRPC client to validate shop code or ID
        const shopValidationResult = await validateShopCode(shop_code);

        if (!shopValidationResult.success || !shopValidationResult.shop) {
            return res.status(404).json({
                message: shopValidationResult.message || 'Shop not found with the provided identifier'
            });
        }

        res.status(200).json({
            message: 'Shop found successfully',
            shop: {
                _id: shopValidationResult.shop.id,
                name: shopValidationResult.shop.name,
                shop_code: shopValidationResult.shop.shop_code,
                category_id: shopValidationResult.shop.category_id
            }
        });
    } catch (error: any) {
        console.error('Get shop by code/ID error:', error);
        res.status(500).json({ message: 'Server error while fetching shop' });
    }
};

// GET /api/shops (optional - get all shops)
// Note: This endpoint is not implemented via gRPC as it would require a different service method
// For now, returning a message indicating the limitation
export const getAllShops = async (req: Request, res: Response) => {
    try {
        res.status(501).json({
            message: 'Get all shops endpoint not implemented via gRPC. Use shop code lookup instead.',
            available_endpoints: [
                'GET /api/shops/by-code/:shop_code - Find shop by shop code'
            ]
        });
    } catch (error: any) {
        console.error('Get all shops error:', error);
        res.status(500).json({ message: 'Server error while fetching shops' });
    }
};
