import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    name: { type: String, required: true },
    contact: { type: String },
    avatar: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Member', memberSchema);

