import { Router } from 'express';
import { getAISummary } from '../controllers/aiSummaryController.js';

const router = Router();

router.route('/:tripId').get(getAISummary);

export default router;

