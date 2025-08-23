import OTP from '../models/OTP';
import { sendSMS } from './smsService';
import { sendEmail } from './emailService';

export const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = async (mobile: string, email?: string): Promise<boolean> => {
    try {
        const code = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Remove any existing OTPs for this mobile/email
        await OTP.deleteMany({
            $or: [
                { mobile },
                ...(email ? [{ email }] : [])
            ]
        });

        // Save new OTP
        await OTP.create({ mobile, email, code, expiresAt });

        // Send OTP via SMS
        const smsSent = await sendSMS(mobile, `Your verification code is: ${code}. It expires in 10 minutes.`);

        // Send OTP via email if provided
        let emailSent = true;
        if (email) {
            emailSent = await sendEmail(
                email,
                'Your Verification Code',
                `Your verification code is: ${code}. It expires in 10 minutes.`,
                `<p>Your verification code is: <strong>${code}</strong>. It expires in 10 minutes.</p>`
            );
        }

        return smsSent && emailSent;
    } catch (error) {
        console.error('Error in sendOTP:', error);
        return false;
    }
};

export const verifyOTP = async (mobile: string, code: string): Promise<boolean> => {
    try {
        const otpRecord = await OTP.findOne({
            mobile,
            code,
            expiresAt: { $gt: new Date() }
        });

        return !!otpRecord;
    } catch (error) {
        console.error('Error in verifyOTP:', error);
        return false;
    }
};