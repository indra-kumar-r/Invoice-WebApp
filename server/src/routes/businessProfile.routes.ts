import express from 'express';
import {
    createProfile,
    getProfile,
    updateProfile,
} from '../controllers/businessProfile.controller.js';

const router = express.Router();

router.post('/', createProfile);
router.get('/', getProfile);
router.put('/:uuid', updateProfile);

export default router;
