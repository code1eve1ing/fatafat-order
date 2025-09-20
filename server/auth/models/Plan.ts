import mongoose, { Document, Schema } from 'mongoose';

export interface IPlan extends Document {
  _id: string;
  title: string;
  desc: string;
  features: string[];
  applicable_role: 'shopkeeper' | 'customer' | 'both';
  price: {
    monthly: number;
    yearly: number;
  };
  usage_period: 'monthly' | 'yearly';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PlanSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Plan title is required'],
    trim: true,
    maxlength: [100, 'Plan title cannot exceed 100 characters']
  },
  desc: {
    type: String,
    required: [true, 'Plan description is required'],
    trim: true,
    maxlength: [500, 'Plan description cannot exceed 500 characters']
  },
  features: [{
    type: String,
    required: true,
    trim: true
  }],
  applicable_role: {
    type: String,
    enum: ['shopkeeper', 'customer', 'both'],
    required: [true, 'Applicable role is required'],
    default: 'shopkeeper'
  },
  price: {
    monthly: {
      type: Number,
      required: [true, 'Monthly price is required'],
      min: [0, 'Price cannot be negative']
    },
    yearly: {
      type: Number,
      required: [true, 'Yearly price is required'],
      min: [0, 'Price cannot be negative']
    }
  },
  usage_period: {
    type: String,
    enum: ['monthly', 'yearly'],
    required: [true, 'Usage period is required'],
    default: 'monthly'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
PlanSchema.index({ applicable_role: 1, isActive: 1 });
PlanSchema.index({ createdAt: -1 });

export default mongoose.model<IPlan>('Plan', PlanSchema);