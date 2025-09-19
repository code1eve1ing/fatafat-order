import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: any;
    shopkeeper?: any;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        
        // For products service, we'll store the user/shopkeeper ID for authorization
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid.' });
    }
};

export const authenticateShopkeeper = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, role?: string };
        
        // Store shopkeeper info for shop-specific operations
        req.shopkeeper = { id: decoded.id };
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid.' });
    }
};
