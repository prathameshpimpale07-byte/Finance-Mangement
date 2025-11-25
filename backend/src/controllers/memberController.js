import Trip from '../models/Trip.js';
import Member from '../models/Member.js';
import Expense from '../models/Expense.js';

const addActivity = async (tripId, message) => {
  const trip = await Trip.findById(tripId);
  if (!trip) return;
  trip.activity.unshift({ message, timestamp: new Date() });
  trip.activity = trip.activity.slice(0, 100);
  await trip.save();
};

export const addMember = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const member = await Member.create({
      trip: tripId,
      name: req.body.name,
      contact: req.body.contact,
      avatar: req.body.avatar,
    });

    trip.members.push(member._id);
    await trip.save();
    await addActivity(tripId, `${member.name} joined the trip`);

    res.status(201).json(member);
  } catch (error) {
    next(error);
  }
};

export const getMembers = async (req, res, next) => {
  try {
    const members = await Member.find({ trip: req.params.tripId }).sort({
      createdAt: 1,
    });
    res.json(members);
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (req, res, next) => {
  try {
    const { tripId, memberId } = req.params;
    const member = await Member.findOne({ _id: memberId, trip: tripId });
    if (!member) return res.status(404).json({ message: 'Member not found' });

    const hasExpenses = await Expense.exists({
      trip: tripId,
      $or: [{ paidBy: memberId }, { 'splits.member': memberId }],
    });
    if (hasExpenses)
      return res
        .status(400)
        .json({ message: 'Member has expenses and cannot be removed' });

    await Member.deleteOne({ _id: memberId });
    await Trip.updateOne(
      { _id: tripId },
      { $pull: { members: memberId } }
    );
    await addActivity(tripId, `${member.name} removed from the trip`);

    res.json({ message: 'Member removed' });
  } catch (error) {
    next(error);
  }
};

export default {
  addMember,
  getMembers,
  removeMember,
};

