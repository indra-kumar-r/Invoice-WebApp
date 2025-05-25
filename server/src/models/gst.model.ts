import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const GSTItemSchema = new mongoose.Schema(
    {
        uuid: { type: String, default: uuidv4, unique: true },
        date: { type: Date },
        company_name: { type: String },
        company_gst_number: { type: String },
        igst_sales: { type: Number },
        cgst: { type: Number },
        sgst: { type: Number },
        gross_total: { type: Number },
        received_amount: { type: Number },
        received_date: { type: Date },
        igst_grand_total: { type: Number },
        cgst_grand_total: { type: Number },
        gross_grand_total: { type: Number },
    },
    { _id: false }
);

const GSTSchema = new mongoose.Schema(
    {
        uuid: { type: String, default: uuidv4, unique: true },
        month_name: { type: String, required: true },
        year: { type: Number, required: true },
        gst_items: [GSTItemSchema],
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

export default mongoose.model('GST', GSTSchema);
