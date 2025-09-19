import mongoose, { Document, Schema } from 'mongoose';

export interface IMenuSection extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    shop_id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const menuSectionSchema = new Schema<IMenuSection>({
    name: {
        type: String,
        required: [true, 'Menu section name is required'],
        trim: true,
        maxlength: [100, 'Menu section name cannot exceed 100 characters']
    },
    shop_id: {
        type: Schema.Types.ObjectId,
        required: [true, 'Shop ID is required'],
        ref: 'Shop'
    }
}, {
    timestamps: true
});

// Index for efficient queries
menuSectionSchema.index({ shop_id: 1 });
menuSectionSchema.index({ shop_id: 1, name: 1 }, { unique: true });

export default mongoose.model<IMenuSection>('MenuSection', menuSectionSchema);
