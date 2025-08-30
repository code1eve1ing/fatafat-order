import express from 'express';
import {
    signup,
    login,
    verifyAccount,
    resendOTP,
    getMe
} from '../controllers/authController';
import {
    validateSignup,
    validateLogin,
    validateVerifyAccount,
    validateResendOTP
} from '../middleware/validation';
import { authenticate } from '../middleware/auth';
import { authLimiter, otpLimiter } from '../middleware/rateLimit';

const router = express.Router();

router.post('/signup', authLimiter, validateSignup, signup);
router.post('/verify', otpLimiter, validateVerifyAccount, verifyAccount);
router.post('/login', authLimiter, validateLogin, login);
router.post('/resend-otp', otpLimiter, validateResendOTP, resendOTP);
router.get('/me', authenticate, getMe);

export default router;