import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    mobile: string;
    email?: string;
    password: string;
    plan_id?: mongoose.Types.ObjectId;
    shop_id?: mongoose.Types.ObjectId;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema = new Schema({
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
    email: {
        type: String,
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
    plan_id: {
        type: Schema.Types.ObjectId,
        ref: 'Plan'
    },
    shop_id: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
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

userSchema.index({ mobile: 1 });
userSchema.index({ email: 1 }, { sparse: true });

export default mongoose.model<IUser>('User', userSchema);