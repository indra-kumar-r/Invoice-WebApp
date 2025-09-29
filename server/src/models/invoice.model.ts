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
            index: true,
        },
        company_name: {
            type: String,
            index: true,
        },
        company_address: String,
        company_gst_no: String,
        date: {
            type: Date,
            required: true,
        },
        dc_nos: [String],
        order_nos: [String],
        invoice_items: [InvoiceItemSchema],

        include_sgst: {
            type: Boolean,
            default: true,
        },
        include_cgst: {
            type: Boolean,
            default: true,
        },
        include_igst: {
            type: Boolean,
            default: false,
        },
        sgst_rate: {
            type: Number,
            default: 2.5,
        },
        cgst_rate: {
            type: Number,
            default: 2.5,
        },
        igst_rate: {
            type: Number,
            default: 5,
        },
        sgst: Number,
        cgst: Number,
        igst: Number,
        total: Number,
        grand_total: Number,
        amount_in_words: String,
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

InvoiceSchema.index({ invoice_no: 1, company_name: 1 });

export default mongoose.model('Invoice', InvoiceSchema);
