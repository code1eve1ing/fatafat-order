import mongoose, { Document, Schema } from 'mongoose';

export interface IDistrict extends Document {
    name: string;
    cityId: mongoose.Types.ObjectId;
}

const districtSchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, 'District name is required'],
        trim: true,
        maxlength: [100, 'District name cannot exceed 100 characters']
    },
    cityId: {
        type: Schema.Types.ObjectId,
        ref: 'City',
        required: [true, 'City ID is required']
    }
}, {
    timestamps: true
});

// Compound index to ensure unique district names within a city
districtSchema.index({ name: 1, cityId: 1 }, { unique: true });
districtSchema.index({ cityId: 1 });

export default mongoose.model<IDistrict>('District', districtSchema);
