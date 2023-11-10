import mongoose from 'mongoose'
const gallerySchema: any = new mongoose.Schema({
    image: { type: String, default: null },
    isActive: { type: Boolean, default: true, },
    createdBy: { type: mongoose.Schema.Types.ObjectId },
    updatedBy: { type: mongoose.Schema.Types.ObjectId },
}, { timestamps: true })

export const galleryModel = mongoose.model<any>('gallery', gallerySchema)