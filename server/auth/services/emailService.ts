// Using Nodemailer with Gmail
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendEmail = async (to: string, subject: string, text: string, html?: string): Promise<boolean> => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log('Email credentials not configured. Email would be:', { to, subject, text });
            return true; // Simulate success in development
        }

        await transporter.sendMail({
            from: `"Auth API" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html: html || text,
        });

        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
};