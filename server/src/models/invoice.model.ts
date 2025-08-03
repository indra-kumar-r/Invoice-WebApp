import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const InvoiceItemSchema = new mongoose.Schema(
    {
        uuid: {
            type: String,
            default: uuidv4,
        },
        sl_no: String,
        name: String,
        quantity: Number,
        rate: Number,
        amount: Number,
    },
    { _id: false }
);

const InvoiceSchema = new mongoose.Schema(
    {
        uuid: {
            type: String,
            default: uuidv4,
        },
        invoice_no: {
            type: String,
            required: true,
        },
        company_name: String,
        company_address: String,
        company_gst_no: String,
        date: String,
        dc_nos: [String],
        order_nos: [String],
        invoice_items: [InvoiceItemSchema],
        gst_id: String,
        total: Number,
        sgst: Number,
        cgst: Number,
        igst: Number,
        grand_total: Number,
        amount_in_words: String,
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

export default mongoose.model('Invoice', InvoiceSchema);
