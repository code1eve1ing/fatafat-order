import mongoose, { Document, Schema } from 'mongoose';

export interface IOTP extends Document {
    mobile: string;
    email?: string;
    code: string;
    expiresAt: Date;
    createdAt: Date;
}

const OTPSchema: Schema = new Schema({
    mobile: {
        type: String,
        required: true
    },
    email: {
        type: String,
        sparse: true
    },
    code: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IOTP>('OTP', OTPSchema);