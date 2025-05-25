import express from 'express';
import {
    createGST,
    getAllGSTs,
    getGSTByUUID,
    updateGST,
    deleteGST,
} from '../controllers/gst.controller.js';

const router = express.Router();

router.post('/', createGST);
router.get('/', getAllGSTs);
router.get('/:uuid', getGSTByUUID);
router.put('/:uuid', updateGST);
router.delete('/:uuid', deleteGST);

export default router;
