import { body } from 'express-validator';

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