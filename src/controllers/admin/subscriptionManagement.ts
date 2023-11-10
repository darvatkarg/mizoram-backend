import { reqInfo } from '../../helpers/winston_logger'
import { subscriptionModel } from '../../database'
import { apiResponse, userStatus } from '../../common'
import { Request, Response } from 'express'
import bcryptjs from 'bcryptjs'
import { email_login_mail } from '../../helpers/mail'
import { func } from 'joi'

const ObjectId = require('mongoose').Types.ObjectId

export const addSubscription = async (req: Request, res: Response) => {
    let body = req.body
    try {
        let response = await new subscriptionModel(body).save()
        // console.log('response :>> ', response);
        if (response) {
            return res.status(200).json(new apiResponse(200, 'add subscription successfully', response, {}))
        } else {
            return res.status(400).json(new apiResponse(400, 'Database error while add subscription', {}, Error))
        }
    } catch (error) {
        console.log('error :>> ', error);
        return res.status(500).json(new apiResponse(500, 'Internal server error', {}, error))
    }
}

export const getSubscription = async (req: Request, res: Response) => {
    try {
        let response = await subscriptionModel.find({ isActive: true })
        // console.log('response :>> ', response);
        if (response) return res.status(200).json(new apiResponse(200, 'Get subscription successfully', response[0], {}))
        else return res.status(400).json(new apiResponse(400, 'Database error while getting subscription', {}, {}))
    } catch (error) {
        console.log('error :>> ', error);
        return res.status(500).json(new apiResponse(500, 'Internal server error', {}, error))
    }
}

export const updateSubscription = async (req: Request, res: Response) => {
    let body = req.body
    try {
        let response = await subscriptionModel.findOneAndUpdate({ _id: ObjectId(body?.id), isActive: true }, body, { new: true })
        // console.log('response :>> ', response);
        if (response) return res.status(200).json(new apiResponse(200, 'subscription update successfully', response, {}))
        else return res.status(400).json(new apiResponse(400, 'Database error while update subscription', {}, {}))
    } catch (error) {
        console.log('error :>> ', error);
        return res.status(500).json(new apiResponse(500, 'Internal server error', {}, error))
    }
}