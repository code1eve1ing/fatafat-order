import express from 'express';
import {
    createPlan,
    getPlans,
    getPlan,
    updatePlan,
    deletePlan,
    validatePlan
} from '../controllers/planController';
import { validatePlan as validatePlanData, validatePlanUpdate } from '../middleware/planValidation';
import { authenticateAdmin } from '../middleware/auth';
import { generalLimiter } from '../middleware/rateLimit';

const router = express.Router();

// Public routes
router.get('/', generalLimiter, getPlans);
router.get('/:id', generalLimiter, getPlan);
router.post('/validate', generalLimiter, validatePlan);

// Admin only routes
router.post('/', generalLimiter, authenticateAdmin, validatePlanData, createPlan);
router.put('/:id', generalLimiter, authenticateAdmin, validatePlanUpdate, updatePlan);
router.delete('/:id', generalLimiter, authenticateAdmin, deletePlan);

export default router;
