import express from 'express';
import {
    createInvoice,
    getAllInvoices,
    getInvoiceByUUID,
    updateInvoice,
    deleteInvoice,
} from '../controllers/invoice.controller.js';

const router = express.Router();

router.post('/', createInvoice);
router.get('/', getAllInvoices);
router.get('/:uuid', getInvoiceByUUID);
router.put('/:uuid', updateInvoice);
router.delete('/:uuid', deleteInvoice);

export default router;
