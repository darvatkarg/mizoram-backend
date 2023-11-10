"use strict"
import { CronJob } from 'cron'
import config from 'config'
import { reminderModel, sabpaisaModel, userModel } from '../database'
import { logger, reqInfo } from './winston_logger'
import nodemailer from 'nodemailer'
import { notification_to_user } from './notification'
//import { notification_data_template, notification_template, URL_decode } from '../common'

//const stripe = require('stripe')((config.get('stripe') as any)?.secret_key)
const ObjectId = require('mongoose').Types.ObjectId
let cronJobs = []


export const reminder = new CronJob('*/10 * * * *', async function () {
    try {
        logger.info(' Cron Job Start')
        //await reminderModel.find({ isActive: true, createdBy: ObjectId() })
        //sendMail();
        logger.info(' Cron Job Finished')

    } catch (error) {
        console.log(error)
    }
})
export const checkSubscription = async () => {
    try {
        const currentDate = new Date();
        currentDate.setUTCHours(0, 0, 0, 0)

        const checkData = await userModel.find({
            isActive: true,
            subscriptionExpDate: { $eq: currentDate }
        });
        let checkBlankValue = await sabpaisaModel.find({
            isActive: true, $or: [
                { email: null },
                { mobile: null }
            ]
        })
        if (checkBlankValue) {
            checkBlankValue.forEach(async (item: any) => {
                let deleteValue = await sabpaisaModel.deleteMany({
                    _id: item._id, isActive: true
                })
            })

        }
        if (checkData) {
            checkData.forEach(async (item: any) => {
                let updateUserSubscription = await userModel.findOneAndUpdate({ _id: item._id, isActive: true }, { isPremium: false }, { new: true })
                // console.log('updateUserSubscription :>> ', updateUserSubscription);
            })

        }
    } catch (error) {
        console.log(error)
    }
}

export const dynamicCronJobs = async () => {
    cronJobs.forEach(cron => {
        cron.stop()
    })
    cronJobs = []
    let today = new Date()
    today = new Date(`${today.toDateString()} 05:30:00`)

}

new CronJob('10 0 * * *', () => {
    dynamicCronJobs() // refresh crons at 12:10 AM every day
}, null, true, "America/New_York")

export const every_minutes_running_cron_job = new CronJob('* * * * *', async function () {
    try {
        await checkSubscription()
    } catch (err) {
        console.log(err);
    }
});