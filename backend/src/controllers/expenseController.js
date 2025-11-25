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
  amountPerPerson,
}) => {
  // Handle 'eachPaysOwn' split type
  if (splitType === 'eachPaysOwn') {
    if (!amountPerPerson) {
      throw new Error('amountPerPerson is required for eachPaysOwn split type');
    }
    const allMembers = memberIds.map(String);
    if (!allMembers.length) throw new Error('No members to split with');
    
    // Each member pays their own amount
    return allMembers.map((memberId) => ({
      member: memberId,
      amount: round(amountPerPerson),
    }));
  }

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
      amountPerPerson,
    } = req.body;

    if (!description || !amount || !paidBy) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!trip.members.some((m) => m._id.equals(paidBy))) {
      return res.status(400).json({ message: 'Paid by member invalid' });
    }

    // For 'eachPaysOwn', calculate total amount from amountPerPerson
    let finalAmount = amount;
    let finalAmountPerPerson = amountPerPerson;
    
    if (splitType === 'eachPaysOwn') {
      if (!amountPerPerson) {
        return res.status(400).json({ message: 'amountPerPerson is required for eachPaysOwn split type' });
      }
      // Total amount = amountPerPerson * number of members
      finalAmount = round(amountPerPerson * trip.members.length);
      finalAmountPerPerson = amountPerPerson;
    }

    const splitPayload = buildSplits({
      amount: finalAmount,
      splitType,
      selectedMembers,
      percentages,
      customSplits,
      memberIds: trip.members.map((m) => m._id),
      amountPerPerson: finalAmountPerPerson,
    });

    const expense = await Expense.create({
      trip: tripId,
      description,
      amount: finalAmount,
      category,
      date,
      paidBy,
      splitType,
      amountPerPerson: splitType === 'eachPaysOwn' ? finalAmountPerPerson : undefined,
      splits: splitPayload.map((split) => ({
        member: new mongoose.Types.ObjectId(split.member),
        amount: split.amount,
        percentage: split.percentage,
      })),
    });

    trip.expenses.push(expense._id);
    await trip.save();

    const payer = await ensureMember(tripId, paidBy);
    const activityMessage = splitType === 'eachPaysOwn'
      ? `${payer.name} added ₹${finalAmount} for ${description} (each person paid ₹${finalAmountPerPerson})`
      : `${payer.name} added ₹${finalAmount} for ${description}`;
    await attachActivity(tripId, activityMessage);

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
      amountPerPerson,
    } = req.body;

    if (paidBy && !trip.members.some((m) => m._id.equals(paidBy))) {
      return res.status(400).json({ message: 'Paid by member invalid' });
    }

    if (splitType || selectedMembers || percentages || customSplits || amount || amountPerPerson) {
      const currentSplitType = splitType ?? expense.splitType;
      let finalAmount = amount ?? expense.amount;
      let finalAmountPerPerson = amountPerPerson ?? expense.amountPerPerson;
      
      if (currentSplitType === 'eachPaysOwn') {
        if (amountPerPerson !== undefined) {
          finalAmountPerPerson = amountPerPerson;
          finalAmount = round(amountPerPerson * trip.members.length);
        } else if (expense.amountPerPerson) {
          finalAmountPerPerson = expense.amountPerPerson;
          finalAmount = round(expense.amountPerPerson * trip.members.length);
        }
      }

      const splitPayload = buildSplits({
        amount: finalAmount,
        splitType: currentSplitType,
        selectedMembers,
        percentages,
        customSplits,
        memberIds: trip.members.map((m) => m._id),
        amountPerPerson: finalAmountPerPerson,
      });
      expense.splits = splitPayload.map((split) => ({
        member: new mongoose.Types.ObjectId(split.member),
        amount: split.amount,
        percentage: split.percentage,
      }));
      
      if (currentSplitType === 'eachPaysOwn') {
        expense.amount = finalAmount;
        expense.amountPerPerson = finalAmountPerPerson;
      }
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

