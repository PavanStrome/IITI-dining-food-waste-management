import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    meal: { type: String, enum: ['breakfast', 'lunch', 'dinner'], required: true },
    items: [{ type: String, required: true }]
  },
  { timestamps: true }
);

menuItemSchema.index({ date: 1, meal: 1 }, { unique: true });

export const MenuItem = mongoose.model('MenuItem', menuItemSchema);







