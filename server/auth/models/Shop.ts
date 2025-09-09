import mongoose, { Document, Schema } from 'mongoose';

export interface IShop extends Document {
    name: string;
    category_id: mongoose.Types.ObjectId;
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
    }
}, {
    timestamps: false
});

export default mongoose.model<IShop>('Shop', shopSchema);
