import express from 'express';
import {
    createCompany,
    getAllCompanies,
    getCompanyByUUID,
    updateCompany,
    deleteCompany,
} from '../controllers/company.controller.js';

const router = express.Router();

router.post('/', createCompany);
router.get('/', getAllCompanies);
router.get('/:uuid', getCompanyByUUID);
router.put('/:uuid', updateCompany);
router.delete('/:uuid', deleteCompany);

export default router;
