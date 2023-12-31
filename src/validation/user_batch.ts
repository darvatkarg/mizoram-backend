"use strict"
import * as Joi from "joi"
import { apiResponse, testType } from '../common'
import { isValidObjectId } from 'mongoose'
import { Request, Response } from 'express'

export const add_batch = async (req: Request, res: Response, next: any) => {
    const schema = Joi.object({
        date: Joi.date().required().error(new Error('date is required!')),
        time_slotId: Joi.string().required().error(new Error('subjectId is required!')),
        subjectId: Joi.string().required().error(new Error('subjectId is required!')),
        selectedUser: Joi.array().required().error(new Error('selectedUser is required!')),
    })
    schema.validateAsync(req.body).then(result => {
        return next()
    }).catch(error => { res.status(400).json(new apiResponse(400, error.message, {}, {})) })
}

export const by_id = async (req: Request, res: Response, next: any) => {
    if (!isValidObjectId(req.params.id)) return res.status(400).json(new apiResponse(400, 'invalid id', {}, {}))
    return next()
}

// export const update = async (req: Request, res: Response, next: any) => {
//     const schema = Joi.object({
//         id: Joi.string().required().error(new Error('id is required')),
//         name: Joi.string().error(new Error('name is string!')),
//         description: Joi.array().error(new Error('description is array!')),
//     })
//     schema.validateAsync(req.body).then(result => {
//         if (!isValidObjectId(req.params.id)) return res.status(400).json(new apiResponse(400, 'invalid id', {}, {}))
//         return next()
//     }).catch(error => {
//         res.status(400).json(new apiResponse(400, error.message, {}, {}));
//     })
// }