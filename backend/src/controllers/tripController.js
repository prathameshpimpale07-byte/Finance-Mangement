import Trip from '../models/Trip.js';
import Member from '../models/Member.js';
import Expense from '../models/Expense.js';

const addActivity = async (trip, message) => {
  trip.activity.unshift({ message, timestamp: new Date() });
  if (trip.activity.length > 100) {
    trip.activity = trip.activity.slice(0, 100);
  }
  await trip.save();
};

export const createTrip = async (req, res, next) => {
  try {
    const { name, startDate, members = [] } = req.body;
    if (!name) return res.status(400).json({ message: 'Trip name is required' });

    const trip = await Trip.create({ name, startDate });

    if (members.length) {
      const createdMembers = await Member.insertMany(
        members.map((member) => ({
          ...member,
          trip: trip._id,
        }))
      );
      trip.members = createdMembers.map((m) => m._id);
      await trip.save();
    }

    await addActivity(trip, `Trip "${trip.name}" created`);

    res.status(201).json(trip);
  } catch (error) {
    next(error);
  }
};

export const getTrips = async (_req, res, next) => {
  try {
    const trips = await Trip.find()
      .populate('members')
      .populate({ path: 'expenses', options: { sort: { createdAt: -1 } } })
      .sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    next(error);
  }
};

export const getTripById = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('members')
      .populate({
        path: 'expenses',
        populate: { path: 'paidBy splits.member' },
      });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (error) {
    next(error);
  }
};

export const updateTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    await addActivity(trip, `Trip "${trip.name}" updated`);
    res.json(trip);
  } catch (error) {
    next(error);
  }
};

export const deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    await Member.deleteMany({ trip: trip._id });
    await Expense.deleteMany({ trip: trip._id });
    await Trip.deleteOne({ _id: trip._id });

    res.json({ message: 'Trip deleted' });
  } catch (error) {
    next(error);
  }
};

export default {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
};

