import express from 'express';
import {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
} from '../controllers/categoryController';
import { validateCategory } from '../middleware/validation';
import { authenticateAdmin } from '../middleware/auth';
import { generalLimiter } from '../middleware/rateLimit';

const router = express.Router();

router.post('/', generalLimiter, authenticateAdmin, validateCategory, createCategory);
router.get('/', generalLimiter, getCategories);
router.get('/:id', generalLimiter, getCategory);
router.put('/:id', generalLimiter, authenticateAdmin, validateCategory, updateCategory);
router.delete('/:id', generalLimiter, authenticateAdmin, deleteCategory);

export default router;