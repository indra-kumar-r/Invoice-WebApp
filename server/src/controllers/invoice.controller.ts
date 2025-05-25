import Invoice from '../models/invoice.model.js';

// Create
export const createInvoice = async (req: any, res: any) => {
    try {
        const invoice = await Invoice.create(req.body);
        res.status(201).json(invoice);
    } catch (error) {
        res.status(500).json({ message: 'Error creating invoice', error });
    }
};

// Get All (summary only)
export const getAllInvoices = async (_req: any, res: any) => {
    try {
        const invoices = await Invoice.find(
            {},
            {
                uuid: 1,
                invoice_no: 1,
                date: 1,
                company_name: 1,
                company_gst_no: 1,
                igst: 1,
                sgst: 1,
                cgst: 1,
                grand_total: 1,
            }
        ).sort({ created_at: -1 });

        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching invoices', error });
    }
};

// Get One
export const getInvoiceByUUID = async (req: any, res: any) => {
    try {
        const invoice = await Invoice.findOne({ uuid: req.params.uuid });
        if (!invoice)
            return res.status(404).json({ message: 'Invoice not found' });
        res.json(invoice);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching invoice', error });
    }
};

// Update
export const updateInvoice = async (req: any, res: any) => {
    try {
        const invoice = await Invoice.findOneAndUpdate(
            { uuid: req.params.uuid },
            req.body,
            { new: true }
        );
        if (!invoice)
            return res.status(404).json({ message: 'Invoice not found' });
        res.json(invoice);
    } catch (error) {
        res.status(500).json({ message: 'Error updating invoice', error });
    }
};

// Delete
export const deleteInvoice = async (req: any, res: any) => {
    try {
        const invoice = await Invoice.findOneAndDelete({
            uuid: req.params.uuid,
        });
        if (!invoice)
            return res.status(404).json({ message: 'Invoice not found' });
        res.json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting invoice', error });
    }
};
