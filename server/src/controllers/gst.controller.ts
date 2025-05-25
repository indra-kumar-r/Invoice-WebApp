import GST from '../models/gst.model.js';

// Create GST summary
export const createGST = async (req: any, res: any) => {
    try {
        const gst = await GST.create(req.body);
        res.status(201).json(gst);
    } catch (error) {
        res.status(500).json({ message: 'Error creating GST record', error });
    }
};

// Get all GST summaries (list)
export const getAllGSTs = async (_req: any, res: any) => {
    try {
        const summaries = await GST.find(
            {},
            {
                uuid: 1,
                month_name: 1,
                year: 1,
                'gst_items.gross_grand_total': 1,
            }
        ).sort({ created_at: -1 });

        // Aggregate gross_grand_total from each gst_items list
        const simplified = summaries.map((gst) => {
            const grossTotal = gst.gst_items.reduce(
                (acc: number, item: any) => acc + (item.gross_grand_total || 0),
                0
            );
            return {
                uuid: gst.uuid,
                month_name: gst.month_name,
                year: gst.year,
                gross_grand_total: parseFloat(grossTotal.toFixed(2)),
            };
        });

        res.json(simplified);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching GST summaries',
            error,
        });
    }
};

// Get one GST
export const getGSTByUUID = async (req: any, res: any) => {
    try {
        const gst = await GST.findOne({ uuid: req.params.uuid });
        if (!gst)
            return res.status(404).json({ message: 'GST record not found' });
        res.json(gst);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching GST record', error });
    }
};

// Update GST
export const updateGST = async (req: any, res: any) => {
    try {
        const gst = await GST.findOneAndUpdate(
            { uuid: req.params.uuid },
            req.body,
            { new: true }
        );
        if (!gst)
            return res.status(404).json({ message: 'GST record not found' });
        res.json(gst);
    } catch (error) {
        res.status(500).json({ message: 'Error updating GST record', error });
    }
};

// Delete GST
export const deleteGST = async (req: any, res: any) => {
    try {
        const gst = await GST.findOneAndDelete({ uuid: req.params.uuid });
        if (!gst)
            return res.status(404).json({ message: 'GST record not found' });
        res.json({ message: 'GST record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting GST record', error });
    }
};
