import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    startDate: { type: Date, default: Date.now },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
    expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }],
    activity: [activitySchema],
  },
  { timestamps: true }
);

export default mongoose.model('Trip', tripSchema);

