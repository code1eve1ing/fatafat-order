import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Shop from '../models/Shop';
import Shopkeeper from '../models/Shopkeeper';
import { sendOTP, verifyOTP } from '../services/otpService';
import { AuthRequest } from '../middleware/auth';
import OTP from '../models/OTP';

const generateToken = (id: string): string => {
    const payload: { id: string, timestamp: number } = { id: id, timestamp: Date.now() }
    return jwt.sign(payload, process.env.JWT_SECRET!);
};

// /auth/signup
export const signup = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { mobile, email, password, user_name, shop_name, shop_category_id } = req.body;

        // 1. Check if user already exists with same mobile or email
        const query: any[] = [{ mobile }]
        if (email) {
            query.push({ email })
        }

        const existingUser = await User.findOne({ $or: query });
        if (existingUser) {
            const conflictField = existingUser.mobile === mobile ? 'mobile number' : 'email';
            return res.status(400).json({ message: `User already exists with this ${conflictField}` });
        }

        // 2. Save shop_name in name, shop_category_id in category_id in Shop model
        const shop = new Shop({
            name: shop_name,
            category_id: shop_category_id
        });

        await shop.save();

        if (!shop._id) {
            return res.status(400).json({ message: 'Failed to create shop. Please try again later.' });
        }

        // 3. Save available User details
        const user = new User({
            email: email || undefined,
            password,
            name: user_name,
            mobile,
            is_verified: false
        });

        await user.save();

        if (!user._id) {
            return res.status(400).json({ message: 'Failed to create user account. Please try again later.' });
        }

        // 4. Save Shopkeeper details
        const shopkeeper = new Shopkeeper({
            user_id: user._id,
            shop_id: shop._id
        });

        await shopkeeper.save();

        // Send OTP for verification
        // const otpSent = await sendOTP(mobile, email);
        // if (!otpSent) {
        //     return res.status(500).json({ message: 'Failed to send verification code' });
        // }

        res.status(201).json({
            message: 'Account created successfully. We have sent verification link to your mobile number' + (email ? ' and email' : ''),
            userId: user._id,
            shop: {
                _id: shop._id,
                name: shop.name,
                category_id: shop.category_id
            },
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

        if (user.is_verified) {
            return res.status(400).json({ message: 'Account is already verified' });
        }

        user.is_verified = true;
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
                // isVerified: user.isVerified
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
                // isVerified: user.isVerified
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

        // if (user.isVerified) {
        //     return res.status(400).json({ message: 'Account is already verified' });
        // }

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


// /auth/me
export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const user_id = req?.user?._id
        const user = await User.findById(user_id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let shopkeeper = null
        let shop = null
        {
            shopkeeper = await Shopkeeper.find({ user_id })
            if (shopkeeper && shopkeeper?.length > 0) {
                shop = await Shop.find({ _id: shopkeeper[0]?.shop_id })
                // if (!shop) {
                //     return res.status(404).json({ message: 'Shop not found' });
                // }
            }
        }

        let customer = null

        res.status(200).json({
            user: {
                _id: user._id,
                mobile: user.mobile,
                email: user.email,
                name: user.name
            },
            role: shopkeeper ? 'shopkeeper' : 'customer',
            shop: shop ? shop[0] : null,
            customer
        })
    } catch (error: any) {
        console.error('Get me error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};