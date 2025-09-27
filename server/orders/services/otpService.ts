import nodemailer from 'nodemailer';
import twilio from 'twilio';
import OTP from '../models/OTP';
import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);
// Email transporter (configure with your email service)
const emailTransporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Twilio client (configure with your Twilio credentials)
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

export const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendEmailOTP = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
        // Generate OTP
        const otp = generateOTP();

        // Save OTP to database
        await OTP.findOneAndUpdate(
            { identifier: email, type: 'email' },
            {
                otp,
                verified: false,
                expires_at: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
            },
            { upsert: true, new: true }
        );

        // Send email (mock implementation - configure with your email service)
        if (process.env.NODE_ENV === 'development') {
            console.log(`📧 Email OTP for ${email}: ${otp}`);
            return { success: true, message: 'OTP sent successfully (check console in dev mode)' };
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Order Verification Code - FataFat',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Your Verification Code</h2>
                    <p>Your OTP for order verification is:</p>
                    <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #007bff; font-size: 32px; margin: 0;">${otp}</h1>
                    </div>
                    <p>This code will expire in 10 minutes.</p>
                    <p>If you didn't request this code, please ignore this email.</p>
                </div>
            `
        };
        console.log("Mailoptions: ", mailOptions);
        await emailTransporter.sendMail(mailOptions);
        return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
        console.error('Error sending email OTP:', error);
        return { success: false, message: 'Failed to send OTP' };
    }
};

export const sendMobileOTP = async (mobile: string): Promise<{ success: boolean; message: string }> => {
    try {
        // Generate OTP
        const otp = generateOTP();

        // Save OTP to database
        await OTP.findOneAndUpdate(
            { identifier: mobile, type: 'mobile' },
            {
                otp,
                verified: false,
                expires_at: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
            },
            { upsert: true, new: true }
        );

        // Send SMS (mock implementation - configure with your SMS service)
        if (process.env.NODE_ENV === 'development') {
            console.log(`📱 Mobile OTP for ${mobile}: ${otp}`);
            return { success: true, message: 'OTP sent successfully (check console in dev mode)' };
        }

        if (!twilioClient) {
            console.log(`📱 Mobile OTP for ${mobile}: ${otp} (Twilio not configured)`);
            return { success: true, message: 'OTP sent successfully (Twilio not configured - check console)' };
        }

        await twilioClient.messages.create({
            body: `Your FataFat order verification code is: ${otp}. Valid for 10 minutes.`,
            from: process.env.TWILIO_PHONE_NUMBER as string,
            to: `+91${mobile}`
        });

        return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
        console.error('Error sending mobile OTP:', error);
        return { success: false, message: 'Failed to send OTP' };
    }
};

export const verifyOTP = async (identifier: string, otp: string, type: 'email' | 'mobile'): Promise<{ success: boolean; message: string }> => {
    try {
        const otpRecord = await OTP.findOne({
            identifier,
            type,
            otp,
            verified: false,
            expires_at: { $gt: new Date() }
        });

        if (!otpRecord) {
            return { success: false, message: 'Invalid or expired OTP' };
        }

        // Mark OTP as verified
        otpRecord.verified = true;
        await otpRecord.save();

        return { success: true, message: 'OTP verified successfully' };
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return { success: false, message: 'Failed to verify OTP' };
    }
};

export const isOTPVerified = async (identifier: string, type: 'email' | 'mobile'): Promise<boolean> => {
    try {
        const otpRecord = await OTP.findOne({
            identifier,
            type,
            verified: true,
            expires_at: { $gt: new Date() }
        });

        return !!otpRecord;
    } catch (error) {
        console.error('Error checking OTP verification:', error);
        return false;
    }
};
