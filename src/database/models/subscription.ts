var mongoose = require('mongoose')
// import mongoose from 'mongoose'
const subscriptionSchema = new mongoose.Schema({
    amount: { type: String, default: null },
    days: { type: Number, default: null },
    isActive: { type: Boolean, default: true },
}, { timestamps: true })

export const subscriptionModel = mongoose.model('subscription_management', subscriptionSchema)