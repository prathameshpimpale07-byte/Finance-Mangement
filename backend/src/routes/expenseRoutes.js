import { Router } from 'express';
import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  toggleSettled,
} from '../controllers/expenseController.js';

const router = Router();

router.route('/:tripId').post(createExpense).get(getExpenses);
router
  .route('/:tripId/:expenseId')
  .put(updateExpense)
  .delete(deleteExpense);
router.patch('/:tripId/:expenseId/settled', toggleSettled);

export default router;

