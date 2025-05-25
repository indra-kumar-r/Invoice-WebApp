import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const BusinessProfileSchema = new mongoose.Schema(
    {
        uuid: {
            type: String,
            default: uuidv4,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        gst_no: {
            type: String,
            required: true,
        },
        mobile_numbers: {
            type: [String],
            default: [],
        },
        company_regulations: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

export default mongoose.model('BusinessProfile', BusinessProfileSchema);
