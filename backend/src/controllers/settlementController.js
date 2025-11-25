import Trip from '../models/Trip.js';
import Member from '../models/Member.js';
import Expense from '../models/Expense.js';
import calculateSettlement from '../utils/calculateSettlement.js';

export const getSettlement = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const members = await Member.find({ trip: tripId });
    const expenses = await Expense.find({ trip: tripId });
    const { ledger, transactions } = calculateSettlement(members, expenses);

    const totals = {
      totalExpense: expenses.reduce((sum, exp) => sum + exp.amount, 0),
      categoryWise: expenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
      }, {}),
    };

    res.json({ ledger, transactions, totals });
  } catch (error) {
    next(error);
  }
};

export default { getSettlement };

