import mongoose, { Document, Schema } from 'mongoose';

export interface IOTP extends Document {
    identifier: string; // email or mobile
    otp: string;
    type: 'email' | 'mobile';
    verified: boolean;
    expires_at: Date;
    created_at: Date;
}

const OTPSchema = new Schema<IOTP>({
    identifier: { 
        type: String, 
        required: true,
        index: true
    },
    otp: { 
        type: String, 
        required: true,
        length: 6
    },
    type: { 
        type: String, 
        enum: ['email', 'mobile'],
        required: true
    },
    verified: { 
        type: Boolean, 
        default: false 
    },
    expires_at: { 
        type: Date, 
        required: true,
        default: function() {
            return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
        }
    },
    created_at: { 
        type: Date, 
        default: Date.now 
    }
});

// TTL index to automatically delete expired OTPs
OTPSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

// Compound index for efficient queries
OTPSchema.index({ identifier: 1, type: 1 });

export default mongoose.model<IOTP>('OTP', OTPSchema);
