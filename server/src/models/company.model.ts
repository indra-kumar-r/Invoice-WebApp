import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const CompanySchema = new mongoose.Schema(
    {
        uuid: {
            type: String,
            default: uuidv4,
            unique: true,
        },
        company_name: {
            type: String,
            required: true,
        },
        company_address: {
            type: String,
            required: true,
        },
        company_gst_no: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

export default mongoose.model('Company', CompanySchema);
