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
        .withMessage('Password must be at least 6 characters long'),
    body('user_name')
        .trim()
        .notEmpty()
        .withMessage('User name is required')
        .isLength({ max: 100 })
        .withMessage('User name cannot exceed 100 characters'),
    body('shop_name')
        .trim()
        .notEmpty()
        .withMessage('Shop name is required')
        .isLength({ max: 100 })
        .withMessage('Shop name cannot exceed 100 characters'),
    body('shop_category_id')
        .isMongoId()
        .withMessage('Invalid shop category ID format')
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

// State validation
export const validateState = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('State name is required')
        .isLength({ max: 100 })
        .withMessage('State name cannot exceed 100 characters'),
    body('code')
        .trim()
        .notEmpty()
        .withMessage('State code is required')
        .isLength({ max: 10 })
        .withMessage('State code cannot exceed 10 characters')
        .matches(/^[A-Z0-9]+$/)
        .withMessage('State code must contain only uppercase letters and numbers')
];

// City validation
export const validateCity = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('City name is required')
        .isLength({ max: 100 })
        .withMessage('City name cannot exceed 100 characters'),
    body('stateId')
        .isMongoId()
        .withMessage('Invalid state ID format')
];

// District validation
export const validateDistrict = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('District name is required')
        .isLength({ max: 100 })
        .withMessage('District name cannot exceed 100 characters'),
    body('cityId')
        .isMongoId()
        .withMessage('Invalid city ID format')
];

// ID validation for area endpoints
export const validateAreaId = [
    param('id')
        .isMongoId()
        .withMessage('Invalid ID format')
];