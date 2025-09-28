import mongoose, { Document, Schema } from 'mongoose';

export interface ICity extends Document {
    name: string;
    stateId: mongoose.Types.ObjectId;
}

const citySchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, 'City name is required'],
        trim: true,
        maxlength: [100, 'City name cannot exceed 100 characters']
    },
    stateId: {
        type: Schema.Types.ObjectId,
        ref: 'State',
        required: [true, 'State ID is required']
    }
}, {
    timestamps: true
});

// Compound index to ensure unique city names within a state
citySchema.index({ name: 1, stateId: 1 }, { unique: true });
citySchema.index({ stateId: 1 });

export default mongoose.model<ICity>('City', citySchema);
