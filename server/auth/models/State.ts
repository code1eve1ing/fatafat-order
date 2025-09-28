import mongoose, { Document, Schema } from 'mongoose';

export interface IState extends Document {
    name: string;
    code: string;
}

const stateSchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, 'State name is required'],
        unique: true,
        trim: true,
        maxlength: [100, 'State name cannot exceed 100 characters']
    },
    code: {
        type: String,
        required: [true, 'State code is required'],
        unique: true,
        trim: true,
        uppercase: true,
        maxlength: [10, 'State code cannot exceed 10 characters']
    }
}, {
    timestamps: true
});

// Create indexes for faster queries
stateSchema.index({ name: 1 });
stateSchema.index({ code: 1 });

export default mongoose.model<IState>('State', stateSchema);
