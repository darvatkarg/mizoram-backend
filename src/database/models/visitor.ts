var mongoose = require('mongoose')
// import mongoose from 'mongoose'
const visitorSchema = new mongoose.Schema({
    date: { type: Date, default: null },
    userId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "user" },
    isActive: { type: Boolean, default: true },

}, { timestamps: true })

export const visitorModel = mongoose.model('visitor', visitorSchema)