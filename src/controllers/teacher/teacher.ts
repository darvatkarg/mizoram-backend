"use strict"
import { reqInfo } from '../../helpers/winston_logger'
import { userModel, visitorModel } from '../../database'
import { apiResponse, URL_decode, userStatus } from '../../common'
import { Request, Response } from 'express'
import { deleteImage } from '../../helpers/S3'
import moment from 'moment'
import { email_verification_mail, email_verification_mail_User } from '../../helpers/mail'

const ObjectId = require('mongoose').Types.ObjectId
export const get_visitor = async (req: Request, res: Response) => {
    reqInfo(req)
    try {
        let response = await visitorModel.countDocuments({ isActive: true })
        if (response) {
            return res.status(200).json(new apiResponse(200, 'get visitor successfully', response, {}))
        }
        else return res.status(404).json(new apiResponse(404, 'Database error while getting profile', {}, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, "Internal Server Error", {}, error))
    }
}

export const get_profile = async (req: Request, res: Response) => {
    reqInfo(req)
    try {
        let response = await userModel.findOne({ _id: ObjectId(req.params.id), isActive: true }, { _id: 1, name: 1, email: 1, phoneNumber: 1, alterPhoneNumber: 1, image: 1, schoolId: 1, isExp: 1, subscriptionExpDate: 1, isPremium: 1, address: 1 })
        // console.log('response-=-=-=-=-=-=-=-=-=-=-=-=-=->>>', response)
        if (response) {
            let data = await visitorModel.create({
                date: new Date(),
                userId: ObjectId((req.header('user') as any)?._id)
            })
            // console.log('data--------------------------------------------------------->>>>', data)
            return res.status(200).json(new apiResponse(200, 'get teacher successfully', response, {}))
        }
        else return res.status(404).json(new apiResponse(404, 'Database error while getting profile', {}, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, "Internal Server Error", {}, error))
    }
}

export const update_profile = async (req: Request, res: Response) => {
    reqInfo(req)
    let body = req.body,
        id = body?.id,
        user: any = req.header('user')
    body.updatedBy = user._id

    try {
        let response = await userModel.findOneAndUpdate({ _id: ObjectId((req.header('user') as any)?._id), isActive: true, userType: userStatus.teacher }, body)
        if (response) {
            if (body?.image != response?.image && response.image != null && body?.image != null && body?.image != undefined) {
                let [folder_name, image_name] = await URL_decode(response?.image)
                await deleteImage(image_name, folder_name)
            }
            // if (response.image != body?.image) {
            //     let [folder_name, image_name] = await URL_decode(response?.image)
            //     await deleteImage(image_name, folder_name)
            // }
            return res.status(200).json(new apiResponse(200, 'Profile updated successfully', {}, {}))
        }
        else return res.status(404).json(new apiResponse(404, 'Database error while updating profile', {}, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, "Internal Server Error", {}, error))
    }
}

export const check_userDays = async (req: Request, res: Response) => {
    reqInfo(req)

    try {
        let today = moment().format("YYYY-MM-DD")
        console.log('today', today)
        let response = await userModel.findOne({ _id: ObjectId((req.header('user') as any)?._id), isActive: true })
        console.log('response.isExp', response.isExp)

        console.log('response-----checkuser--->>', response)
        if (response) {
            if (new Date(today) < new Date(response.isExp)) {
                console.log('today < response.isExp', today < response.isExp)
                return res.status(200).json(new apiResponse(200, 'User is not Expire', {}, {}))

                // return res.status(205).json(new apiResponse(205, 'User is Expire', {}, {}))
            }
            return res.status(200).json(new apiResponse(205, 'User is Expire', {}, {}))
            // return res.status(200).json(new apiResponse(200, 'User is not Expire', {}, {}))

        }
        else return res.status(404).json(new apiResponse(404, 'Database error while updating profile', {}, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, "Internal Server Error", {}, error))
    }
}

export const send_otp = async (req: Request, res: Response) => {
    reqInfo(req)
    let body = req.body
    try {
        let after45days = moment().add(45, 'days');

        let after45daysString = after45days.format('YYYY-MM-DD');
        console.log('after45daysString', after45daysString)
        let data: any = await userModel.findOne({ email: body.email, isActive: true })

        // console.log('data2', data)
        if (!data) return res.status(400).json(new apiResponse(400, "Invaild Email", {}, {}));
        let otp = Math.floor(300000 + Math.random() * 500000),
            otpExpireTime = new Date(new Date().setMinutes(new Date().getMinutes() + 5))
        body.otp = otp
        body.otpExpireTime = otpExpireTime

        // let dateChng = await userModel.findOneAndUpdate({ email: body.email, isActive: true }, { isExp: after45daysString }, { new: true })
        // console.log('dateChng', dateChng)
        var resend_otp_mail: any = await email_verification_mail_User({ email: data?.email, otp: otp, otpExpireTime: otpExpireTime })
        console.log("resend_otp_mail=-=-=>>>>", resend_otp_mail);

        let response: any = await userModel.findOneAndUpdate({ email: body.email, isActive: true }, { otp: otp, otpExpireTime: otpExpireTime }, { new: true })
        if (response) {
            return res.status(200).send(new apiResponse(200, "otp resend successfully!!", {}, {}))
        } else {
            return res.status(403).send(new apiResponse(403, "Cannot otp send", {}, {}))
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, "Internal Server Error", {}, error))
    }
}

export const user_otp_verification = async (req: Request, res: Response) => {
    reqInfo(req)
    let body = req.body
    try {
        let after45days = moment().add(45, 'days');

        let after45daysString = after45days.format('YYYY-MM-DD');
        console.log('after45daysString', after45daysString)
        let response: any = await userModel.findOne({ email: body.email, isActive: true })
        console.log('response', response)

        if (!response) {
            return res.status(404).json(new apiResponse(404, "Invaild email", null, {}))
        } else {
            let otpVerify = await userModel.findOne({ email: response.email, otp: body.otp, isActive: true })
            if (otpVerify) {
                let timeDiff = new Date().getTime() - new Date(response.otpExpireTime).getTime()
                if (timeDiff > 0) {
                    return res.status(206).json(new apiResponse(206, "Otp is expire", null, {}))
                }
                let d = await userModel.findOneAndUpdate({ email: body.email, otp: body.otp, isActive: true }, { otp: null, otpExpireTime: null, isExp: after45daysString }, { new: true })
                console.log('d-================================-=-=--=-=-=-=-=--=->>>', d)

                response = { response: d };
                return res.status(200).json(new apiResponse(200, "Otp is verify", response, {}))
            } else {
                return res.status(404).json(new apiResponse(404, "Otp is invaild", null, {}))
            }
        }
    } catch (error) {
        console.log("error", error)
        return res.status(500).json(new apiResponse(500, "Internal Server Error", {}, error))
    }
}
