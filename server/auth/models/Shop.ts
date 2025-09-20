import mongoose, { Document, Schema } from 'mongoose';

export interface IShop extends Document {
    name: string;
    category_id: mongoose.Types.ObjectId;
    shop_code: string;
}

const shopSchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, 'Shop name is required'],
        trim: true,
        maxlength: [100, 'Shop name cannot exceed 100 characters']
    },
    category_id: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Shop category is required']
    },
    shop_code: {
        type: String,
        required: [true, 'Shop code is required'],
        unique: true,
        trim: true,
        maxlength: [20, 'Shop code cannot exceed 20 characters']
    }
}, {
    timestamps: false
});

export default mongoose.model<IShop>('Shop', shopSchema);
