import mongoose, { Document, Schema } from 'mongoose';

export interface IShopkeeper extends Document {
    user_id: mongoose.Types.ObjectId;
    shop_id: mongoose.Types.ObjectId;
    plan_id?: mongoose.Types.ObjectId;
}

const shopkeeperSchema: Schema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        unique: true
    },
    shop_id: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
        required: [true, 'Shop ID is required']
    },
    plan_id: {
        type: Schema.Types.ObjectId,
        ref: 'Plan'
    }
}, {
    timestamps: false
});

export default mongoose.model<IShopkeeper>('Shopkeeper', shopkeeperSchema);
