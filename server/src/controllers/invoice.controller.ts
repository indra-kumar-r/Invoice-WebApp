import { v4 as uuidv4 } from 'uuid';
import Invoice from '../models/invoice.model.js';

// Create
export const createInvoice = async (req: any, res: any) => {
    try {
        if (Array.isArray(req.body.invoice_items)) {
            req.body.invoice_items = req.body.invoice_items.map(
                (item: any) => ({
                    uuid: uuidv4(),
                    ...item,
                })
            );
        }

        if (!req.body.uuid) {
            req.body.uuid = uuidv4();
        }

        const invoice = await Invoice.create(req.body);
        res.status(201).json(invoice);
    } catch (error) {
        res.status(500).json({ message: 'Error creating invoice', error });
    }
};

// Get All (summary only)
export const getAllInvoices = async (_req: any, res: any) => {
    try {
        const { search, page = 1, fromDate, toDate, company } = _req.query;

        const query: any = {};

        if (search) {
            query.$or = [
                { invoice_no: { $regex: search, $options: 'i' } },
                { company_name: { $regex: search, $options: 'i' } },
            ];
        }

        if (company) {
            query.company_name = company;
        }

        if (fromDate && toDate) {
            const from = parseDateString(fromDate);
            const to = parseDateString(toDate);

            query.$expr = {
                $and: [
                    {
                        $gte: [
                            {
                                $dateFromString: {
                                    dateString: '$date',
                                    format: '%d-%m-%Y',
                                },
                            },
                            from,
                        ],
                    },
                    {
                        $lte: [
                            {
                                $dateFromString: {
                                    dateString: '$date',
                                    format: '%d-%m-%Y',
                                },
                            },
                            to,
                        ],
                    },
                ],
            };
        }

        const limit = 10;
        const skip = (parseInt(page) - 1) * limit;

        const invoices = await Invoice.find(query, {
            uuid: 1,
            invoice_no: 1,
            date: 1,
            company_name: 1,
            company_gst_no: 1,
            igst: 1,
            sgst: 1,
            cgst: 1,
            grand_total: 1,
        })
            .sort({ invoice_no: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Invoice.countDocuments(query);

        res.json({
            data: invoices,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
        });
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

// Helper functions
const parseDateString = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split('-');
    return new Date(`${year}-${month}-${day}T00:00:00.000Z`);
};
