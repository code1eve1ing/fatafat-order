import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
    name: string;
}

const categorySchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true,
        trim: true,
        maxlength: [50, 'Category name cannot exceed 50 characters']
    }
}, {
    timestamps: false // Explicitly disabling timestamps
});

// Create an index on the name field for faster queries
categorySchema.index({ name: 1 });

export default mongoose.model<ICategory>('Category', categorySchema);