import mongoose from 'mongoose'

const video_training_logSchema: any = new mongoose.Schema({
    logLatestDate: { type: Date },
    logUserId: { type: mongoose.Schema.Types.ObjectId, default: null },   //0 - 9:00-12:00 || 1- 12:00-3:00 || 2- 3:00-6:00
    subjectId: { type: mongoose.Schema.Types.ObjectId, default: null },
    topicCovered: { type: Number, default: null },
    isCompleted: { type: Boolean, default: false },
    // isActive: { type: Boolean, default: true, },
    // createdBy: { type: mongoose.Schema.Types.ObjectId, default: null },
    // updatedBy: { type: mongoose.Schema.Types.ObjectId, default: null },
})

export const video_training_logModel = mongoose.model<any>('video_training_log', video_training_logSchema)