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
      required: function() {
        return this.paymentSource !== 'tripPool';
      },
    },
    splitType: {
      type: String,
      enum: ['equal', 'selected', 'percentage', 'custom', 'eachPaysOwn'],
      default: 'equal',
    },
    splits: [splitSchema],
    amountPerPerson: Number, // For 'eachPaysOwn' split type
    settled: { type: Boolean, default: false }, // Mark expense as settled/paid
    paymentSource: {
      type: String,
      enum: ['member', 'tripPool'],
      default: 'member',
    }, // Whether paid by member or from trip pool
  },
  { timestamps: true }
);

export default mongoose.model('Expense', expenseSchema);

