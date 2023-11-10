"use strict"
import { reqInfo } from '../../helpers/winston_logger'
import { userModel } from '../../database'
import { apiResponse, userStatus } from '../../common'
import { Request, Response } from 'express'
import { email_login_mail } from '../../helpers/mail'
import bcryptjs from 'bcryptjs'

const ObjectId = require('mongoose').Types.ObjectId

export const add_auditor = async (req: Request, res: Response) => {
    reqInfo(req)
    let body = req.body,
        // pass = body.password,
        { user }: any = req.headers
    req.body.createdBy = (user?._id)
    try {
        let isAlready: any = await userModel.findOne({ email: body.email }, { isActive: true })
        console.log(isAlready);
        let authToken = 0
        if (!isAlready) {
            const salt = await bcryptjs.genSaltSync(8)
            const hashPassword = await bcryptjs.hash(body.password, salt)
            body.password = hashPassword
            // delete body.password
            // for (let flag = 0; flag < 1;) {
            //     authToken = await Math.round(Math.random() * 1000000)
            //     if (authToken.toString().length == 6) {
            //         flag++
            //     }
            // }
            body.authToken = authToken
            body.userType = userStatus.auditor
            // body.isPhoneVerified = true
            let data = await userModel.create(body);
            if (data) {
                // let mail = await email_login_mail(data, pass)
                return res.status(200).json(new apiResponse(200, "Auditor added successfully", data, {}))
            }
            return res.status(409).json(new apiResponse(409, 'Auditor added failed', {}, {}))
            // let response = await new userModel(req.body).save()
            // if (response) return res.status(200).json(new apiResponse(200, 'Auditor added successfully', {}, {}))
            // else return res.status(400).json(new apiResponse(400, 'database error while adding sub admin ', {}, Error))
        }
        else { return res.status(403).json({ 'message': "email is already exist" }) }
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, 'Internal server error', {}, error))
    }
}

export const get_auditor = async (req: Request, res: Response) => {
    reqInfo(req)
    try {
        let response = await userModel.find({ userType: userStatus.auditor, isActive: true }, { name: 1, email: 1, phoneNumber: 1, image: 1 })
        if (response) return res.status(200).json(new apiResponse(200, 'Get auditor successfully', response, {}))
        else return res.status(400).json(new apiResponse(400, 'Database error while getting auditor details', {}, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, "Internal server error", {}, error))
    }
}

export const by_id_auditor = async (req: Request, res: Response) => {
    reqInfo(req)
    let body: any = req.body,
        id = req.params.id
    try {
        let response = await userModel.findOne({ _id: ObjectId(id), isActive: true, userType: userStatus.auditor }, { name: 1, email: 1, phoneNumber: 1 })
        if (response) return res.status(200).json(new apiResponse(200, 'Get auditor details successfully', response, {}))
        else return res.status(400).json(new apiResponse(400, 'Database error while getting auditor details', {}, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, "Internal server error", {}, error))
    }
}

export const update_auditor = async (req: Request, res: Response) => {
    reqInfo(req)
    let body: any = req.body
    body.updatedBy = (req.header('user') as any)?._id
    try {
        let response = await userModel.findOneAndUpdate({ _id: ObjectId(body.id), isActive: true, userType: userStatus.auditor }, body)
        if (response) return res.status(200).json(new apiResponse(200, 'Auditor detail updated successfully', {}, {}))
        else return res.status(400).json(new apiResponse(400, 'Database error while updating auditor ', {}, Error))
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, 'Internal server error', {}, {}))
    }
}

export const delete_auditor = async (req: Request, res: Response) => {
    reqInfo(req)
    let user: any = req.header('user')
    let id = req.params.id
    try {
        let response = await userModel.findOneAndUpdate({ _id: ObjectId(id), isActive: true, userType: userStatus.auditor }, { isActive: false, updatedBy: ObjectId((req.header('user') as any)?._id) }).select('image _id email name')
        if (response) return res.status(200).json(new apiResponse(200, 'Auditor successfully deleted', response, {}))
        else return res.status(400).json(new apiResponse(400, 'Database error while deleting auditor', {}, {}))
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, 'Internal server error', {}, {}))
    }
}

export const filter_auditor = async (req: Request, res: Response) => {
    reqInfo(req)
    let user: any = req.header('user'),
        { _id, search, limit, page, ascending } = req.body,
        skip = 0,
        response: any = {},
        match: any = {},
        sort: any = {}
    limit = parseInt(limit)
    skip = ((parseInt(page) - 1) * parseInt(limit))
    try {
        // Database Filtering
        if (_id?.length != 0 && _id !== undefined) {
            _id.forEach(function (part, index, theArray) {
                theArray[index] = ObjectId(String(part))
            });
            match['_id'] = { "$in": _id }
        }
        if (search) {
            var nameArray: Array<any> = []
            var emailArray: Array<any> = []
            var alter_emailArray: Array<any> = []
            var phoneNumberArray: Array<any> = []
            search = search.split(" ")
            search.forEach(data => {
                nameArray.push({ name: { $regex: data, $options: 'si' } })
                emailArray.push({ email: { $regex: data, $options: 'si' } })
                alter_emailArray.push({ alter_email: { $regex: data, $options: 'si' } })
                phoneNumberArray.push({ phoneNumber: { $regex: data, $options: 'si' } })
            })
            match.$or = [{ $and: nameArray }, { $and: emailArray }, { $and: phoneNumberArray }, { $and: alter_emailArray }]
        }

        match.isActive = true
        match.userType = userStatus.auditor
        // Sorting Database
        sort.createdAt = -1
        if (ascending) sort.createdAt = 1

        let auditor_data = await userModel.aggregate([
            { $match: match },
            {
                $facet: {
                    user: [
                        { $sort: sort },
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $project: {
                                _id: 1, name: 1, email: 1, phoneNumber: 1,
                                image: 1
                            }
                        }
                    ],
                    auditor_count: [{ $count: "count" }]
                }
            }
        ])
        response.auditor_data = auditor_data[0].user || []
        response.state = {
            page, limit,
            page_limit: Math.ceil(auditor_data[0]?.auditor_count[0]?.count / limit)
        }
        res.status(200).json(new apiResponse(200, `Get auditor successfully`, response, {}))
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, 'Internal server error', {}, {}))
    }
}