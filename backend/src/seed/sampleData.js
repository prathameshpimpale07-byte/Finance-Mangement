import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Trip from '../models/Trip.js';
import Member from '../models/Member.js';
import Expense from '../models/Expense.js';

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tripsplit');

  await Trip.deleteMany();
  await Member.deleteMany();
  await Expense.deleteMany();

  const trip = await Trip.create({ name: 'Goa Getaway', startDate: new Date() });
  const members = await Member.insertMany([
    { trip: trip._id, name: 'Prathamesh', contact: 'prath@example.com' },
    { trip: trip._id, name: 'Amit', contact: 'amit@example.com' },
    { trip: trip._id, name: 'Sagar', contact: 'sagar@example.com' },
  ]);

  trip.members = members.map((m) => m._id);
  await trip.save();

  const [prath, amit] = members;

  const expense = await Expense.create({
    trip: trip._id,
    description: 'Hotel stay',
    amount: 6000,
    category: 'Stay',
    paidBy: prath._id,
    splitType: 'equal',
    splits: members.map((member) => ({
      member: member._id,
      amount: 2000,
    })),
  });

  trip.expenses.push(expense._id);
  await trip.save();

  console.log('Seed data inserted');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

