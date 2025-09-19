import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
    _id: mongoose.Types.ObjectId;
    shop_id: mongoose.Types.ObjectId;
    name: string;
    menu_section_id: mongoose.Types.ObjectId;
    price: number;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
    shop_id: {
        type: Schema.Types.ObjectId,
        required: [true, 'Shop ID is required'],
        ref: 'Shop'
    },
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    menu_section_id: {
        type: Schema.Types.ObjectId,
        required: [true, 'Menu section ID is required'],
        ref: 'MenuSection'
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be a positive number']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    }
}, {
    timestamps: true
});

// Indexes for efficient queries
productSchema.index({ shop_id: 1 });
productSchema.index({ menu_section_id: 1 });
productSchema.index({ shop_id: 1, menu_section_id: 1 });

export default mongoose.model<IProduct>('Product', productSchema);
