import mongoose from 'mongoose';

const advanceContributionSchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
    },
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now },
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model('AdvanceContribution', advanceContributionSchema);

