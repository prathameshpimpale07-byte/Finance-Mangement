import mongoose from 'mongoose';

const splitSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
    },
    amount: { type: Number, required: true },
    percentage: Number,
  },
  { _id: false }
);

const expenseSchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    category: {
      type: String,
      enum: ['Travel', 'Food', 'Stay', 'Shopping', 'Misc'],
      default: 'Misc',
    },
    date: { type: Date, default: Date.now },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
    },
    splitType: {
      type: String,
      enum: ['equal', 'selected', 'percentage', 'custom'],
      default: 'equal',
    },
    splits: [splitSchema],
  },
  { timestamps: true }
);

export default mongoose.model('Expense', expenseSchema);

