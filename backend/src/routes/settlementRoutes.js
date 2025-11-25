import { Router } from 'express';
import { getSettlement } from '../controllers/settlementController.js';

const router = Router();

router.route('/:tripId').get(getSettlement);

export default router;

