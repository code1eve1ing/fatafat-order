import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { sendOTP, verifyOTP } from '../services/otpService';
import { AuthRequest } from '../middleware/auth';
import OTP from '../models/OTP';

const generateToken = (id: string): string => {
    const payload: { id: string, timestamp: number } = { id: id, timestamp: Date.now() }
    return jwt.sign(payload, process.env.JWT_SECRET!);
};

export const signup = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { mobile, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ mobile });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this mobile number' });
        }

        // Create unverified user
        const user = new User({
            mobile,
            email: email || undefined,
            password,
            isVerified: false
        });

        await user.save();

        // Send OTP for verification
        // const otpSent = await sendOTP(mobile, email);
        // if (!otpSent) {
        //     return res.status(500).json({ message: 'Failed to send verification code' });
        // }

        if (!user._id) {
            return res.status(400).json({ message: 'Failed to create your account. Please try again later.' });
        }

        res.status(201).json({
            message: 'User created successfully. Please verify your account with the OTP sent to your mobile/email.',
            userId: user._id,
            token: generateToken(user._id.toString()),
        });
    } catch (error: any) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error during signup' });
    }
};

export const verifyAccount = async (req: Request, res: Response) => {
    try {
        const { mobile, code } = req.body;

        const isValid = await verifyOTP(mobile, code);
        if (!isValid) {
            return res.status(400).json({ message: 'Invalid or expired verification code' });
        }

        const user = await User.findOne({ mobile });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Account is already verified' });
        }

        user.isVerified = true;
        await user.save();

        // Clean up OTP record
        await OTP.deleteOne({ mobile, code });

        if (!user._id) {
            return res.status(400).json({ message: 'User not found' });
        }
        const token = generateToken(user._id.toString());

        res.json({
            message: 'Account verified successfully',
            token,
            user: {
                id: user._id,
                mobile: user.mobile,
                email: user.email,
                isVerified: user.isVerified
            }
        });
    } catch (error: any) {
        console.error('Verify account error:', error);
        res.status(500).json({ message: 'Server error during verification' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { identifier, password } = req.body;

        const user = await User.findOne({ mobile: identifier });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // if (!user.isVerified) {
        //     // Resend OTP for verification
        //     const otpSent = await sendOTP(user.mobile, user.email);
        //     if (!otpSent) {
        //         return res.status(500).json({ message: 'Failed to send verification code' });
        //     }

        //     return res.status(400).json({
        //         message: 'Account not verified. A new verification code has been sent to your mobile/email.'
        //     });
        // }

        if (!user._id) {
            return res.status(400).json({ message: 'User not found' });
        }
        const token = generateToken(user._id.toString());

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                mobile: user.mobile,
                email: user.email,
                isVerified: user.isVerified
            }
        });
    } catch (error: any) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

export const resendOTP = async (req: Request, res: Response) => {
    try {
        const { mobile } = req.body;

        const user = await User.findOne({ mobile });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Account is already verified' });
        }

        const otpSent = await sendOTP(mobile, user.email);
        if (!otpSent) {
            return res.status(500).json({ message: 'Failed to send verification code' });
        }

        res.json({ message: 'Verification code sent successfully' });
    } catch (error: any) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ message: 'Server error while resending OTP' });
    }
};

export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;
        res.json({
            user: {
                id: user!._id,
                mobile: user!.mobile,
                email: user!.email,
                isVerified: user!.isVerified,
                plan_id: user!.plan_id,
                shop_id: user!.shop_id,
                createdAt: user!.createdAt
            }
        });
    } catch (error: any) {
        console.error('Get me error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};