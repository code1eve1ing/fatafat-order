import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

export interface AuthRequest extends Request {
    user?: IUser;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'Token is not valid.' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid.' });
    }
};

export const authenticateAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const adminSecret = req.header('Admin_secret')
        const adminEmail = req.header('Admin_email')
        const adminPassword = req.header('Admin_password')

        if (!adminSecret || !adminEmail || !adminPassword) {
            return res.status(401).json({ message: 'Access denied.' });
        }

        if (adminSecret === 'adminSecret' && adminEmail === 'adminEmail' && adminPassword === 'adminPassword') {
            next();
        } else {
            return res.status(401).json({ message: 'Unauthorized' });
        }

    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};