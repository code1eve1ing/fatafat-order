import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
    product_id: string;
    product_name: string;
    price: number;
    quantity: number;
    total: number;
}

export interface IOrder extends Document {
    order_id: string;
    shop_id: string;
    customer_email?: string;
    customer_mobile?: string;
    customer_name?: string;
    items: IOrderItem[];
    subtotal: number;
    tax_amount: number;
    total_amount: number;
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
    payment_method?: string;
    notes?: string;
    created_at: Date;
    updated_at: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
    product_id: { type: String, required: true },
    product_name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    total: { type: Number, required: true, min: 0 }
});

const OrderSchema = new Schema<IOrder>({
    order_id: { 
        type: String, 
        required: true, 
        unique: true,
        default: function() {
            return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
    },
    shop_id: { type: String, required: true, index: true },
    customer_email: { 
        type: String, 
        validate: {
            validator: function(v: string) {
                return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'Invalid email format'
        }
    },
    customer_mobile: { 
        type: String,
        validate: {
            validator: function(v: string) {
                return !v || /^[6-9]\d{9}$/.test(v);
            },
            message: 'Invalid mobile number format'
        }
    },
    customer_name: { type: String, trim: true },
    items: { type: [OrderItemSchema], required: true, validate: [arrayLimit, 'Order must have at least one item'] },
    subtotal: { type: Number, required: true, min: 0 },
    tax_amount: { type: Number, default: 0, min: 0 },
    total_amount: { type: Number, required: true, min: 0 },
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
        default: 'pending'
    },
    payment_status: { 
        type: String, 
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    payment_method: { type: String },
    notes: { type: String, maxlength: 500 },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

function arrayLimit(val: IOrderItem[]) {
    return val.length > 0;
}

// Update the updated_at field before saving
OrderSchema.pre('save', function(next) {
    this.updated_at = new Date();
    next();
});

// Indexes for better query performance
OrderSchema.index({ shop_id: 1, created_at: -1 });
OrderSchema.index({ customer_email: 1 });
OrderSchema.index({ customer_mobile: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ created_at: -1 });

export default mongoose.model<IOrder>('Order', OrderSchema);
