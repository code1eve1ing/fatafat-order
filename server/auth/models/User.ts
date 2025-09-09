import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    email?: string;
    password: string;
    name: string;
    mobile: string;
    is_verified: boolean;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema = new Schema({
    email: {
        type: String,
        unique: true,
        sparse: true,
        validate: {
            validator: function (v: string) {
                return v === '' ? true : /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: 'Please enter a valid email'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    mobile: {
        type: String,
        required: [true, 'Mobile number is required'],
        unique: true,
        validate: {
            validator: function (v: string) {
                return /^\d{10}$/.test(v);
            },
            message: 'Mobile number must be 10 digits'
        }
    },
    is_verified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: false
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(12);
        if (typeof this.password != 'string') {
            throw new Error('Password must be a string');
        };
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

// Email index is defined here with sparse: true to allow multiple null values
userSchema.index({ email: 1 }, { sparse: true });

export default mongoose.model<IUser>('User', userSchema);