"use strict"
import axios from 'axios'
import querystring from "querystring";

export const sendSMS = async (countryCode, number: any, messageTemplate: any,) => {
    return new Promise(async (resolve, reject) => {
        try {
            number = `${countryCode}${number}`
            let SMS_URL = `https://sms.happysms.in/api/sendhttp.php?authkey=396862Axt1WaBN64648668P1&sender=ENVITE&mobiles=${number}&route=4&message=${messageTemplate}`
            // SMS_URL = querystring.escape(SMS_URL)
            console.log(SMS_URL);
            let SMSResponse: any = await axios.get(SMS_URL)
            resolve(true)
        } catch (error) {
            console.log(error)
            reject(error)
        }
    });
}