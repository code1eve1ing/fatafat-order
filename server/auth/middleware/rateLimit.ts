import rateLimit from 'express-rate-limit';
require('dotenv').config();
console.log("NODE_ENV", process.env.NODE_ENV)
// General rate limiter
export const generalLimiter = rateLimit({
    windowMs: process.env.NODE_ENV === "development" ? 100000 : 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === "development" ? 100000 : 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

// Strict rate limiter for auth endpoints
export const authLimiter = rateLimit({
    windowMs: process.env.NODE_ENV === "development" ? 100000 : 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === "development" ? 100000 : 5, // limit each IP to 5 requests per windowMs
    message: 'Too many authentication attempts from this IP, please try again later.'
});

// OTP-specific rate limiter
export const otpLimiter = rateLimit({
    windowMs: process.env.NODE_ENV === "development" ? 100000 : 60 * 60 * 1000, // 1 hour
    max: process.env.NODE_ENV === "development" ? 100000 : 3, // limit each IP to 3 OTP requests per hour
    message: 'Too many OTP requests from this IP, please try again later.'
});