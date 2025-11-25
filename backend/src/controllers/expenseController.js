import mongoose from 'mongoose';
import Trip from '../models/Trip.js';
import Expense from '../models/Expense.js';
import Member from '../models/Member.js';

const round = (value) =>
  Math.round((Number(value) + Number.EPSILON) * 100) / 100;

const buildSplits = ({
  amount,
  splitType,
  selectedMembers = [],
  percentages = [],
  customSplits = [],
  memberIds = [],
}) => {
  const targetMembers =
    selectedMembers.length > 0 ? selectedMembers : memberIds.map(String);
  if (!targetMembers.length) throw new Error('No members to split with');

  if (splitType === 'percentage') {
    return percentages.map((item) => ({
      member: item.member,
      amount: round((amount * item.percentage) / 100),
      percentage: item.percentage,
    }));
  }

  if (splitType === 'custom') {
    return customSplits.map((item) => ({
      member: item.member,
      amount: round(item.amount),
    }));
  }

  const perHead = round(amount / targetMembers.length);
  return targetMembers.map((memberId) => ({
    member: memberId,
    amount: perHead,
  }));
};

const attachActivity = async (tripId, message) => {
  const trip = await Trip.findById(tripId);
  if (!trip) return;
  trip.activity.unshift({ message, timestamp: new Date() });
  trip.activity = trip.activity.slice(0, 100);
  await trip.save();
};

const ensureMember = async (tripId, memberId) => {
  const member = await Member.findOne({ _id: memberId, trip: tripId });
  if (!member) throw new Error('Member not part of this trip');
  return member;
};

export const createExpense = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const trip = await Trip.findById(tripId).populate('members');
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const {
      description,
      amount,
      category,
      date,
      paidBy,
      splitType = 'equal',
      selectedMembers,
      percentages,
      customSplits,
    } = req.body;

    if (!description || !amount || !paidBy) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!trip.members.some((m) => m._id.equals(paidBy))) {
      return res.status(400).json({ message: 'Paid by member invalid' });
    }

    const splitPayload = buildSplits({
      amount,
      splitType,
      selectedMembers,
      percentages,
      customSplits,
      memberIds: trip.members.map((m) => m._id),
    });

    const expense = await Expense.create({
      trip: tripId,
      description,
      amount,
      category,
      date,
      paidBy,
      splitType,
      splits: splitPayload.map((split) => ({
        member: new mongoose.Types.ObjectId(split.member),
        amount: split.amount,
        percentage: split.percentage,
      })),
    });

    trip.expenses.push(expense._id);
    await trip.save();

    const payer = await ensureMember(tripId, paidBy);
    await attachActivity(
      tripId,
      `${payer.name} added ₹${amount} for ${description}`
    );

    res.status(201).json(expense);
  } catch (error) {
    next(error);
  }
};

export const getExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ trip: req.params.tripId })
      .populate('paidBy')
      .populate('splits.member')
      .sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    next(error);
  }
};

export const updateExpense = async (req, res, next) => {
  try {
    const { tripId, expenseId } = req.params;
    const expense = await Expense.findOne({ _id: expenseId, trip: tripId });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    const trip = await Trip.findById(tripId).populate('members');
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const {
      description,
      amount,
      category,
      date,
      paidBy,
      splitType,
      selectedMembers,
      percentages,
      customSplits,
    } = req.body;

    if (paidBy && !trip.members.some((m) => m._id.equals(paidBy))) {
      return res.status(400).json({ message: 'Paid by member invalid' });
    }

    if (splitType || selectedMembers || percentages || customSplits || amount) {
      const splitPayload = buildSplits({
        amount: amount ?? expense.amount,
        splitType: splitType ?? expense.splitType,
        selectedMembers,
        percentages,
        customSplits,
        memberIds: trip.members.map((m) => m._id),
      });
      expense.splits = splitPayload.map((split) => ({
        member: new mongoose.Types.ObjectId(split.member),
        amount: split.amount,
        percentage: split.percentage,
      }));
    }

    if (description) expense.description = description;
    if (amount) expense.amount = amount;
    if (category) expense.category = category;
    if (date) expense.date = date;
    if (paidBy) expense.paidBy = paidBy;
    if (splitType) expense.splitType = splitType;

    await expense.save();

    await attachActivity(
      tripId,
      `Expense "${expense.description}" was updated`
    );

    res.json(expense);
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = async (req, res, next) => {
  try {
    const { tripId, expenseId } = req.params;
    const expense = await Expense.findOne({ _id: expenseId, trip: tripId });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    await Expense.deleteOne({ _id: expenseId });
    await Trip.updateOne(
      { _id: tripId },
      { $pull: { expenses: expenseId } }
    );

    await attachActivity(
      tripId,
      `Expense "${expense.description}" was deleted`
    );

    res.json({ message: 'Expense deleted' });
  } catch (error) {
    next(error);
  }
};

export default {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
};

