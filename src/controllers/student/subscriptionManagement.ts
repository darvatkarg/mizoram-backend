import { reqInfo } from '../../helpers/winston_logger'
import { subscriptionModel } from '../../database'
import { apiResponse, userStatus } from '../../common'
import { Request, Response } from 'express'
import bcryptjs from 'bcryptjs'
import { email_login_mail } from '../../helpers/mail'
import { func } from 'joi'

const ObjectId = require('mongoose').Types.ObjectId

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
