import express from 'express';
import {
    // State controllers
    createState,
    getStates,
    getState,
    updateState,
    deleteState,
    // City controllers
    createCity,
    getCities,
    getCity,
    updateCity,
    deleteCity,
    // District controllers
    createDistrict,
    getDistricts,
    getDistrict,
    updateDistrict,
    deleteDistrict,
    // Combined controller
    getAllAreas
} from '../controllers/areaController';
import { 
    validateState, 
    validateCity, 
    validateDistrict, 
    validateAreaId 
} from '../middleware/validation';
import { authenticateAdmin } from '../middleware/auth';
import { generalLimiter } from '../middleware/rateLimit';

const router = express.Router();

// State routes
router.post('/states', generalLimiter, authenticateAdmin, validateState, createState);
router.get('/states', generalLimiter, getStates);
router.get('/states/:id', generalLimiter, validateAreaId, getState);
router.put('/states/:id', generalLimiter, authenticateAdmin, validateAreaId, validateState, updateState);
router.delete('/states/:id', generalLimiter, authenticateAdmin, validateAreaId, deleteState);

// City routes
router.post('/cities', generalLimiter, authenticateAdmin, validateCity, createCity);
router.get('/cities', generalLimiter, getCities);
router.get('/cities/:id', generalLimiter, validateAreaId, getCity);
router.put('/cities/:id', generalLimiter, authenticateAdmin, validateAreaId, validateCity, updateCity);
router.delete('/cities/:id', generalLimiter, authenticateAdmin, validateAreaId, deleteCity);

// District routes
router.post('/districts', generalLimiter, authenticateAdmin, validateDistrict, createDistrict);
router.get('/districts', generalLimiter, getDistricts);
router.get('/districts/:id', generalLimiter, validateAreaId, getDistrict);
router.put('/districts/:id', generalLimiter, authenticateAdmin, validateAreaId, validateDistrict, updateDistrict);
router.delete('/districts/:id', generalLimiter, authenticateAdmin, validateAreaId, deleteDistrict);

// Combined route for hierarchical data
router.get('/all', generalLimiter, getAllAreas);

export default router;
