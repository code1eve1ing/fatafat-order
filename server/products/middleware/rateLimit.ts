import rateLimit from 'express-rate-limit';
require('dotenv').config();

// General rate limiter
export const generalLimiter = rateLimit({
    windowMs: process.env.NODE_ENV === "development" ? 100000 : 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === "development" ? 100000 : 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

// Product-specific rate limiter
export const productLimiter = rateLimit({
    windowMs: process.env.NODE_ENV === "development" ? 100000 : 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === "development" ? 100000 : 50, // limit each IP to 50 product requests per windowMs
    message: 'Too many product requests from this IP, please try again later.'
});
