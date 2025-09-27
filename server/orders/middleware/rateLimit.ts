import rateLimit from 'express-rate-limit';

// General rate limiter
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// OTP rate limiter - more restrictive
export const otpLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 3, // limit each IP to 3 OTP requests per minute
    message: {
        error: 'Too many OTP requests, please try again after a minute.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Order creation rate limiter
export const orderLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 10, // limit each IP to 10 order attempts per 5 minutes
    message: {
        error: 'Too many order attempts, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
