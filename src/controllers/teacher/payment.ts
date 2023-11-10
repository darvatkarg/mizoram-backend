"use strict"
import { reqInfo } from '../../helpers/winston_logger'
import { sabpaisaModel, subscriptionModel, userModel } from '../../database'
import { apiResponse, } from '../../common'
import { Request, Response } from 'express'
import mongoose from 'mongoose'
import config from 'config'
import CryptoJS from 'react-native-crypto-js'
import moment from 'moment'

const ObjectId = mongoose.Types.ObjectId

export const payment = async (req: Request, res: Response) => {
    reqInfo(req)
    let body = req.body
    // let userId = (req.header('user') as any)?._id
    try {
        console.log('body:>> ', body);
        let transDate = new Date(body?.transDate);
        transDate.setUTCHours(0, 0, 0, 0);
        // console.log('transDate :>> ', transDate);
        let response = await new sabpaisaModel({
            name: body?.name,
            email: body?.email,
            mobile: body?.mobile,
            clientTxnId: body?.clientTxnId,
            amount: body?.amount,
            paymentMode: body?.paymentMode,
            bankName: body?.bankName,
            status: body?.status,
            sabpaisaTxnId: body?.sabpaisaTxnId,
            bankTxnId: body?.bankTxnId,
            transDate: transDate,
            createdBy: body?.userId,
        }).save()
        // console.log('response :>> ', response);
        if (response) {

            let getSubscription = await subscriptionModel.findOne({ isActive: true })
            // console.log('getSubscription :>> ', getSubscription);
            if (response.status === "SUCCESS") {
                const daysToAdd = getSubscription?.days; // Change this to the number of days you want to add
                const newExpirationDate = new Date();
                newExpirationDate.setDate(newExpirationDate.getDate() + daysToAdd);
                newExpirationDate.setUTCHours(0, 0, 0, 0);
                // console.log('newExpirationDate :>> ', newExpirationDate);
                let updateUser = await userModel.findOneAndUpdate({ _id: ObjectId(body?.userId), isActive: true }, { isPremium: true, subscriptionExpDate: newExpirationDate }, { new: true })
                // console.log('updateUser :>> ', updateUser);
                return res.status(200).json(new apiResponse(200, 'Payment Done', {}, {}))
            } else {
                let updateUser = await userModel.findOneAndUpdate({ _id: ObjectId(body?.userId), isActive: true }, { isPremium: false, subscriptionExpDate: null }, { new: true })
                console.log('updateUser :>> ', updateUser);
                return res.status(400).json(new apiResponse(400, 'Payment Failed', {}, {}))
            }
        } else {
            return res.status(400).json(new apiResponse(400, 'Geeting error while payment', {}, {}))
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, 'Internal server error', {}, {}))
    }
}