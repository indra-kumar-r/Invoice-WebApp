import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const GSTItemSchema = new mongoose.Schema(
    {
        uuid: { type: String, default: uuidv4, unique: true },
        invoice_no: { type: String },
        date: { type: String },
        company_name: { type: String },
        company_gst_number: { type: String },
        igst: { type: Number },
        cgst: { type: Number },
        sgst: { type: Number },
        total: { type: Number },
    },
    { _id: false }
);

const GSTSchema = new mongoose.Schema(
    {
        uuid: { type: String, default: uuidv4, unique: true },
        month_name: { type: String, required: true },
        year: { type: Number, required: true },
        total: { type: Number },
        gst_items: [GSTItemSchema],
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

export default mongoose.model('GST', GSTSchema);
