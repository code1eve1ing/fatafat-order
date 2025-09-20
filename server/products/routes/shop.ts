import express from 'express';
import {
    getShopByCode,
    getAllShops
} from '../controllers/shopController';
import { validateShopCode } from '../middleware/validation';

const router = express.Router();

// Get shop by shop code
router.get('/by-code/:shop_code', validateShopCode, getShopByCode);

// Get all shops (optional endpoint)
router.get('/', getAllShops);

export default router;
