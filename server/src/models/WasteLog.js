import mongoose from 'mongoose';
import { MESS_OPTIONS } from '../utils/constants.js';

const wasteLogSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    meal: { type: String, enum: ['breakfast', 'lunch', 'dinner'], required: true },
    itemName: { type: String, required: true },
    quantityPreparedKg: { type: Number, required: true, min: 0 },
    wasteKg: { type: Number, required: true, min: 0 },
    dryWasteKg: { type: Number, default: 0, min: 0 },
    wetWasteKg: { type: Number, default: 0, min: 0 },
    mess: { type: String, enum: MESS_OPTIONS, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export const WasteLog = mongoose.model('WasteLog', wasteLogSchema);




