import { body, param } from 'express-validator';

export const validateSignup = [
    body('mobile')
        .isLength({ min: 10, max: 10 })
        .withMessage('Mobile must be 10 digits')
        .isNumeric()
        .withMessage('Mobile must contain only numbers'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];

export const validateLogin = [
    body('identifier')
        .notEmpty()
        .withMessage('Identifier is required'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

export const validateVerifyAccount = [
    body('mobile')
        .isLength({ min: 10, max: 10 })
        .withMessage('Mobile must be 10 digits')
        .isNumeric()
        .withMessage('Mobile must contain only numbers'),
    body('code')
        .isLength({ min: 6, max: 6 })
        .withMessage('Verification code must be 6 digits')
        .isNumeric()
        .withMessage('Verification code must contain only numbers')
];

export const validateResendOTP = [
    body('mobile')
        .isLength({ min: 10, max: 10 })
        .withMessage('Mobile must be 10 digits')
        .isNumeric()
        .withMessage('Mobile must contain only numbers')
];

export const validateCategory = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .isLength({ max: 50 })
        .withMessage('Category name cannot exceed 50 characters')
];

export const validateCategoryId = [
    param('id')
        .isMongoId()
        .withMessage('Invalid category ID format')
];