import { Router } from 'express';
import {
  addContribution,
  getContributions,
  deleteContribution,
  getPoolSummary,
} from '../controllers/contributionController.js';

const router = Router();

router.route('/:tripId').post(addContribution).get(getContributions);
router.route('/:tripId/summary').get(getPoolSummary);
router.route('/:tripId/:contributionId').delete(deleteContribution);

export default router;

