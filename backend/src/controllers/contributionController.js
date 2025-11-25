import Trip from '../models/Trip.js';
import Member from '../models/Member.js';
import AdvanceContribution from '../models/AdvanceContribution.js';
import Expense from '../models/Expense.js';

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

export const addContribution = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const { memberId, amount, date, notes } = req.body;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (!memberId || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Member and amount are required' });
    }

    await ensureMember(tripId, memberId);

    const contribution = await AdvanceContribution.create({
      trip: tripId,
      member: memberId,
      amount: Number(amount),
      date: date || new Date(),
      notes,
    });

    const member = await Member.findById(memberId);
    await attachActivity(
      tripId,
      `${member.name} contributed ₹${amount} to trip pool`
    );

    res.status(201).json(contribution);
  } catch (error) {
    next(error);
  }
};

export const getContributions = async (req, res, next) => {
  try {
    const contributions = await AdvanceContribution.find({
      trip: req.params.tripId,
    })
      .populate('member', 'name')
      .sort({ date: -1 });
    res.json(contributions);
  } catch (error) {
    next(error);
  }
};

export const deleteContribution = async (req, res, next) => {
  try {
    const { tripId, contributionId } = req.params;
    const contribution = await AdvanceContribution.findOne({
      _id: contributionId,
      trip: tripId,
    });

    if (!contribution) {
      return res.status(404).json({ message: 'Contribution not found' });
    }

    await AdvanceContribution.deleteOne({ _id: contributionId });

    const member = await Member.findById(contribution.member);
    await attachActivity(
      tripId,
      `Contribution of ₹${contribution.amount} by ${member?.name || 'member'} was removed`
    );

    res.json({ message: 'Contribution deleted' });
  } catch (error) {
    next(error);
  }
};

export const getPoolSummary = async (req, res, next) => {
  try {
    const { tripId } = req.params;

    const contributions = await AdvanceContribution.find({ trip: tripId })
      .populate('member', 'name');
    const expenses = await Expense.find({ trip: tripId, paymentSource: 'tripPool' });

    const totalContributions = contributions.reduce((sum, c) => sum + c.amount, 0);
    const totalSpentFromPool = expenses.reduce((sum, e) => sum + e.amount, 0);
    const remainingBalance = totalContributions - totalSpentFromPool;

    // Calculate contributions per member
    const contributionsByMember = {};
    contributions.forEach((c) => {
      const memberId = c.member._id.toString();
      if (!contributionsByMember[memberId]) {
        contributionsByMember[memberId] = {
          member: c.member,
          total: 0,
        };
      }
      contributionsByMember[memberId].total += c.amount;
    });

    // Calculate return per member (proportional to contributions)
    const returns = Object.values(contributionsByMember).map((entry) => {
      const contributionRatio = totalContributions > 0 
        ? entry.total / totalContributions 
        : 0;
      return {
        member: entry.member,
        contributed: entry.total,
        returnAmount: remainingBalance > 0 
          ? Math.round((remainingBalance * contributionRatio + Number.EPSILON) * 100) / 100
          : 0,
      };
    });

    res.json({
      totalContributions,
      totalSpentFromPool,
      remainingBalance,
      contributions: contributionsByMember,
      returns,
      contributionCount: contributions.length,
      expenseCount: expenses.length,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  addContribution,
  getContributions,
  deleteContribution,
  getPoolSummary,
};

