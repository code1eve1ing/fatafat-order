import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

export const validateSendOTP = [
    body('identifier')
        .notEmpty()
        .withMessage('Email or mobile is required'),
    body('type')
        .isIn(['email', 'mobile'])
        .withMessage('Type must be either email or mobile'),
    body('identifier').custom((value, { req }) => {
        const type = req.body.type;
        if (type === 'email') {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                throw new Error('Invalid email format');
            }
        } else if (type === 'mobile') {
            if (!/^[6-9]\d{9}$/.test(value)) {
                throw new Error('Invalid mobile number format (10 digits starting with 6-9)');
            }
        }
        return true;
    }),
    handleValidationErrors
];

export const validateVerifyOTP = [
    body('identifier')
        .notEmpty()
        .withMessage('Email or mobile is required'),
    body('otp')
        .isLength({ min: 6, max: 6 })
        .withMessage('OTP must be 6 digits'),
    body('type')
        .isIn(['email', 'mobile'])
        .withMessage('Type must be either email or mobile'),
    handleValidationErrors
];

export const validateCreateOrder = [
    body('shop_id')
        .notEmpty()
        .withMessage('Shop ID is required'),
    body('customer_email')
        .optional()
        .isEmail()
        .withMessage('Invalid email format'),
    body('customer_mobile')
        .optional()
        .matches(/^[6-9]\d{9}$/)
        .withMessage('Invalid mobile number format'),
    body('customer_name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Customer name must be between 2 and 50 characters'),
    body('items')
        .isArray({ min: 1 })
        .withMessage('Order must have at least one item'),
    body('items.*.product_id')
        .notEmpty()
        .withMessage('Product ID is required for each item'),
    body('items.*.product_name')
        .notEmpty()
        .withMessage('Product name is required for each item'),
    body('items.*.price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    body('items.*.quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity must be at least 1'),
    body('subtotal')
        .isFloat({ min: 0 })
        .withMessage('Subtotal must be a positive number'),
    body('total_amount')
        .isFloat({ min: 0 })
        .withMessage('Total amount must be a positive number'),
    body('notes')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Notes cannot exceed 500 characters'),
    handleValidationErrors
];

export const validateOrderId = [
    param('orderId')
        .notEmpty()
        .withMessage('Order ID is required'),
    handleValidationErrors
];

export const validateShopId = [
    param('shopId')
        .notEmpty()
        .withMessage('Shop ID is required'),
    handleValidationErrors
];
