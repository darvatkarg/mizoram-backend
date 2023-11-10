import mongoose from "mongoose";

const user_batchSchema: any = new mongoose.Schema(
  {
    date: { type: Date },
    time_slotId: { type: mongoose.Schema.Types.ObjectId, default: null }, //0 - 9:00-12:00 || 1- 12:00-3:00 || 2- 3:00-6:00
    subjectId: { type: mongoose.Schema.Types.ObjectId, default: null },
    selectedUser: { type: [{ type: mongoose.Schema.Types.ObjectId }] },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, default: null },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, default: null },
  },
  { timestamps: true }
);

export const user_batchModel = mongoose.model<any>(
  "user_batch",
  user_batchSchema
);
