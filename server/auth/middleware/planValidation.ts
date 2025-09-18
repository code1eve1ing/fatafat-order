import { body } from 'express-validator';

export const validatePlan = [
    body('title')
        .notEmpty()
        .withMessage('Plan title is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Plan title must be between 2 and 100 characters')
        .trim(),
    
    body('desc')
        .notEmpty()
        .withMessage('Plan description is required')
        .isLength({ min: 10, max: 500 })
        .withMessage('Plan description must be between 10 and 500 characters')
        .trim(),
    
    body('features')
        .isArray({ min: 1 })
        .withMessage('At least one feature is required')
        .custom((features) => {
            if (!Array.isArray(features)) return false;
            return features.every(feature => 
                typeof feature === 'string' && feature.trim().length > 0
            );
        })
        .withMessage('All features must be non-empty strings'),
    
    body('applicable_role')
        .isIn(['shopkeeper', 'customer', 'both'])
        .withMessage('Applicable role must be shopkeeper, customer, or both'),
    
    body('price.monthly')
        .isNumeric()
        .withMessage('Monthly price must be a number')
        .isFloat({ min: 0 })
        .withMessage('Monthly price cannot be negative'),
    
    body('price.yearly')
        .isNumeric()
        .withMessage('Yearly price must be a number')
        .isFloat({ min: 0 })
        .withMessage('Yearly price cannot be negative'),
    
    body('usage_period')
        .isIn(['monthly', 'yearly'])
        .withMessage('Usage period must be monthly or yearly'),
    
    body('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean value')
];

export const validatePlanUpdate = [
    body('title')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Plan title must be between 2 and 100 characters')
        .trim(),
    
    body('desc')
        .optional()
        .isLength({ min: 10, max: 500 })
        .withMessage('Plan description must be between 10 and 500 characters')
        .trim(),
    
    body('features')
        .optional()
        .isArray({ min: 1 })
        .withMessage('At least one feature is required')
        .custom((features) => {
            if (!Array.isArray(features)) return false;
            return features.every(feature => 
                typeof feature === 'string' && feature.trim().length > 0
            );
        })
        .withMessage('All features must be non-empty strings'),
    
    body('applicable_role')
        .optional()
        .isIn(['shopkeeper', 'customer', 'both'])
        .withMessage('Applicable role must be shopkeeper, customer, or both'),
    
    body('price.monthly')
        .optional()
        .isNumeric()
        .withMessage('Monthly price must be a number')
        .isFloat({ min: 0 })
        .withMessage('Monthly price cannot be negative'),
    
    body('price.yearly')
        .optional()
        .isNumeric()
        .withMessage('Yearly price must be a number')
        .isFloat({ min: 0 })
        .withMessage('Yearly price cannot be negative'),
    
    body('usage_period')
        .optional()
        .isIn(['monthly', 'yearly'])
        .withMessage('Usage period must be monthly or yearly'),
    
    body('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean value')
];
