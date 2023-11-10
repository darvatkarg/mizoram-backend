var mongoose = require('mongoose')
// import mongoose from 'mongoose'
const sabpaisaSchema = new mongoose.Schema({
    name: { type: String, default: null },
    email: { type: String, default: null },
    mobile: { type: String, default: null },
    clientTxnId: { type: String, default: null },
    amount: { type: String, default: null },
    paymentMode: { type: String, default: null },
    bankName: { type: String, default: null },
    status: { type: String, default: null },
    sabpaisaTxnId: { type: String, default: null },
    bankTxnId: { type: String, default: null },
    transDate: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId },
}, { timestamps: true })

export const sabpaisaModel = mongoose.model('sabpaisa', sabpaisaSchema)