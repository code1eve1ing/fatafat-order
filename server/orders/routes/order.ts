import express from 'express';
import {
    sendOTP,
    verifyOTPController,
    createOrder,
    getOrder,
    getOrdersByShop,
    updateOrderStatus
} from '../controllers/orderController';
import {
    validateSendOTP,
    validateVerifyOTP,
    validateCreateOrder,
    validateOrderId,
    validateShopId
} from '../middleware/validation';
import { otpLimiter, orderLimiter } from '../middleware/rateLimit';

const router = express.Router();

// OTP routes
router.post('/send-otp', otpLimiter, validateSendOTP, sendOTP);
router.post('/verify-otp', validateVerifyOTP, verifyOTPController);

// Order routes
router.post('/', orderLimiter, validateCreateOrder, createOrder);
router.get('/:orderId', validateOrderId, getOrder);
router.get('/shop/:shopId', validateShopId, getOrdersByShop);
router.patch('/:orderId/status', validateOrderId, updateOrderStatus);

export default router;
