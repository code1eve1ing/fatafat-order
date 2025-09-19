import { body, param } from 'express-validator';

export const validateMenuSection = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Menu section name is required')
        .isLength({ max: 100 })
        .withMessage('Menu section name cannot exceed 100 characters'),
    body('shop_id')
        .isMongoId()
        .withMessage('Invalid shop ID format')
];

export const validateMenuSectionId = [
    param('id')
        .isMongoId()
        .withMessage('Invalid menu section ID format')
];

export const validateProduct = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Product name is required')
        .isLength({ max: 100 })
        .withMessage('Product name cannot exceed 100 characters'),
    body('shop_id')
        .isMongoId()
        .withMessage('Invalid shop ID format'),
    body('menu_section_id')
        .isMongoId()
        .withMessage('Invalid menu section ID format'),
    body('price')
        .isNumeric()
        .withMessage('Price must be a number')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters')
];

export const validateProductId = [
    param('id')
        .isMongoId()
        .withMessage('Invalid product ID format')
];

export const validateShopId = [
    param('shopId')
        .isMongoId()
        .withMessage('Invalid shop ID format')
];
