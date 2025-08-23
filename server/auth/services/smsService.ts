// Using Twilio as the SMS provider
import twilio from 'twilio';
import { MessageListInstanceCreateOptions } from 'twilio/lib/rest/api/v2010/account/message';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export const sendSMS = async (to: string, body: string): Promise<boolean> => {
    try {
        if (!accountSid || !authToken) {
            console.log('Twilio credentials not configured. SMS would be:', { to, body });
            return true; // Simulate success in development
        }

        const msgData: MessageListInstanceCreateOptions = {
            body,
            from: twilioPhone || "",
            to: `+91${to}` // Assuming Indian numbers, adjust as needed
        };

        await client.messages.create(msgData);

        return true;
    } catch (error) {
        console.error('SMS sending failed:', error);
        return false;
    }
};