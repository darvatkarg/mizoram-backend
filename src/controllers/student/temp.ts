"use strict";
import { reqInfo } from "../../helpers/winston_logger";
import {
  answerModel,
  bookModel,
  resultModel,
  schoolModel,
  stateModel,
  training_optionModel,
  userModel,
} from "../../database";
import { SMSTemplate, apiResponse } from "../../common";
import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import { custom_mail } from "../../helpers/mail";
import config from "config";
import axios from "axios";
import pdf from "pdf-creator-node";
import { teacherData } from "./userData";
// let { teacherData }: any = require('./teacherData')
import fs, { existsSync, mkdirSync, writeFileSync } from "fs";
var https = require("follow-redirects").https;
import InfoBip from "infobip-nodejs";
import { getS3File, upload_all_type } from "../../helpers/S3";
import { sendSMS } from "../../helpers/happy_sms";
const ObjectId = require("mongoose").Types.ObjectId;
const SMS: any = config.get("SMS");

export const downloading_S3_records = async (req: Request, res: Response) => {
  reqInfo(req);
  try {
    // Get All Booking Records
    let bookData = await bookModel.find({ isActive: true });

    // Now one by one download files and change to upload folder
    for (let i = 0; i < bookData?.length; i++) {
      console.log(i);
      // let [audioData, imageData, ePubData, pdfData]: any = await Promise.all([
      //     getS3File(bookData[i]?.audio),
      //     getS3File(bookData[i]?.image),
      //     getS3File(bookData[i]?.ePub),
      //     getS3File(bookData[i]?.pdf),
      // ])
      let audioData: any = await getS3File(bookData[i]?.audio);
      console.log("Audio data complete download!");
      let imageData: any = await getS3File(bookData[i]?.image);
      console.log("Image data complete download!");
      let ePubData: any = await getS3File(bookData[i]?.ePub);
      console.log("ePub data complete download!");
      let pdfData: any = await getS3File(bookData[i]?.pdf);
      console.log("PDF data complete download!");
      if (!existsSync(`${process.cwd()}/upload`)) {
        mkdirSync(`${process.cwd()}/upload`);
      }
      // Audio Checking
      if (audioData && bookData[i]?.audio) {
        let eachFolder: any = bookData[i]?.audio?.split("/");
        if (eachFolder?.length == 0) {
          return;
        }
        let folderPath: any = `${process.cwd()}/upload`;
        for (let j = 0; j < eachFolder?.length - 1; j++) {
          folderPath = `${folderPath}/${eachFolder[j]}`;
          if (!existsSync(`${folderPath}`)) {
            mkdirSync(`${folderPath}`);
          }
        }
        writeFileSync(
          `${folderPath}/${eachFolder[eachFolder?.length - 1]}`,
          audioData?.Body
        );
      }
      // Image Checking
      if (imageData && bookData[i]?.image) {
        let eachFolder: any = bookData[i]?.image?.split("/");
        if (eachFolder?.length == 0) {
          return;
        }
        let folderPath: any = `${process.cwd()}/upload`;
        for (let j = 0; j < eachFolder?.length - 1; j++) {
          folderPath = `${folderPath}/${eachFolder[j]}`;
          if (!existsSync(`${folderPath}`)) {
            mkdirSync(`${folderPath}`);
          }
        }
        writeFileSync(
          `${folderPath}/${eachFolder[eachFolder?.length - 1]}`,
          imageData?.Body
        );
      }
      // E-pub Checking
      if (ePubData && bookData[i]?.ePub) {
        let eachFolder: any = bookData[i]?.ePub?.split("/");
        if (eachFolder?.length == 0) {
          return;
        }
        let folderPath: any = `${process.cwd()}/upload`;
        for (let j = 0; j < eachFolder?.length - 1; j++) {
          folderPath = `${folderPath}/${eachFolder[j]}`;
          if (!existsSync(`${folderPath}`)) {
            mkdirSync(`${folderPath}`);
          }
        }
        writeFileSync(
          `${folderPath}/${eachFolder[eachFolder?.length - 1]}`,
          ePubData?.Body
        );
      }
      // PDF Checking
      if (pdfData && bookData[i]?.pdf) {
        let eachFolder: any = bookData[i]?.pdf?.split("/");
        if (eachFolder?.length == 0) {
          return;
        }
        let folderPath: any = `${process.cwd()}/upload`;
        for (let j = 0; j < eachFolder?.length - 1; j++) {
          folderPath = `${folderPath}/${eachFolder[j]}`;
          if (!existsSync(`${folderPath}`)) {
            mkdirSync(`${folderPath}`);
          }
        }
        writeFileSync(
          `${folderPath}/${eachFolder[eachFolder?.length - 1]}`,
          pdfData?.Body
        );
      }
    }
    return res
      .status(200)
      .json(new apiResponse(200, "Testing successfully done!", {}, {}));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new apiResponse(500, "Internal Server Error", {}, error));
  }
};

export const temp_testing_v1 = async (req: Request, res: Response) => {
  reqInfo(req);
  let end_limit: any = 2000,
    response: any,
    start_limit: any = 1000,
    user_new_data: any = [],
    passwordHash: any,
    training_option_data: any = [],
    mobileLast3Digits: any,
    optionTypeArray: any = [
      "Recorded Online Training",
      "Live Training Session",
      "Physical Training",
    ];
  try {
    // console.log(teacherData[0]?.email)
    // await (userData as any).forEach(async (data, index) => {
    // userData[index].firstName = data?.firstName.charAt(0).toUpperCase() + data?.firstName.slice(1)
    // userData[index].lastName = data?.lastName.charAt(0).toUpperCase() + data?.lastName.slice(1)
    // userData[index].region = data?.region.charAt(0).toUpperCase() + data?.region.slice(1)
    // userData[index].district = data?.district.charAt(0).toUpperCase() + data?.district.slice(1)
    // userData[index].school = data?.school.charAt(0).toUpperCase() + data?.school.slice(1)
    const salt = await bcryptjs.genSaltSync(10);
    for (let i = start_limit; i < end_limit; i++) {
      console.log(teacherData[i]?.email);

      let findUser = await userModel.findOne({ email: teacherData[i]?.email });
      if (!findUser) {
        mobileLast3Digits = String(teacherData[i]?.mobile).substr(
          String(teacherData[i]?.mobile).length - 3
        );
        passwordHash = await bcryptjs.hash(
          `${teacherData[i]?.email.split("@")[0]}${mobileLast3Digits}`,
          salt
        );

        response = await new userModel({
          name:
            (teacherData[i]?.firstName as any).charAt(0).toUpperCase() +
            (teacherData[i]?.firstName as any).slice(1).toLowerCase() +
            " " +
            (teacherData[i]?.lastName as any).charAt(0).toUpperCase() +
            (teacherData[i]?.lastName as any).slice(1).toLowerCase(),
          region:
            teacherData[i]?.region == undefined
              ? ""
              : (teacherData[i]?.region as any).charAt(0).toUpperCase() +
                (teacherData[i]?.region as any).slice(1).toLowerCase(),
          city:
            teacherData[i]?.district == undefined
              ? ""
              : (teacherData[i]?.district as any).charAt(0).toUpperCase() +
                (teacherData[i]?.district as any).slice(1).toLowerCase(),
          schoolName:
            teacherData[i]?.school == undefined
              ? ""
              : (teacherData[i]?.school as any).charAt(0).toUpperCase() +
                (teacherData[i]?.school as any).slice(1).toLowerCase(),
          email: teacherData[i]?.email,
          teacherID: teacherData[i]?.teacherID,
          registeredDate: teacherData[i]?.dateRegistered,
          phoneNumber: String(teacherData[i]?.mobile).slice(3),
          countryCode: "233",
          country: "Ghana",
          isEmailVerified: true,
          isPhoneVerified: true,
          password: passwordHash,
        })
          .save()
          .then((data) => {
            return data;
          })
          .catch((error) => {
            console.log(error);
          });
        if (response) {
          await new training_optionModel({
            optionType: optionTypeArray.indexOf(teacherData[i]?.trainingOption),
            subjectId: ObjectId("61648f4bfa12f00e6b9d8036"),
            createdBy: ObjectId(response?._id),
          }).save();
        }
      }
    }

    // })

    // console.log(userData?.firstName.charAt(0).toUpperCase() + userData?.firstName.slice(1).toLowerCase());
    // console.log(userData[0].firstName.charAt(0).toUpperCase() + userData[0]?.firstName.slice(1));

    // response = await new userModel().save()
    return res
      .status(200)
      .json(new apiResponse(200, "Testing successfully done!", response, {}));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new apiResponse(500, "Internal Server Error", {}, error));
  }
};

export const temp_testing_msg = async (req: Request, res: Response) => {
  reqInfo(req);
  let response: any,
    mobileLast3Digits: any,
    password: any,
    skip: any = 2997,
    limit: any = 850;
  try {
    // response = await userModel.aggregate([
    //     { $match: { isActive: true, userType: 0, } },
    //     { $sort: { createdAt: -1 } },
    //     { $skip: skip },
    //     { $limit: limit }
    // ])
    // for (let i = 0; i < response?.length; i++) {
    //     console.log(i);
    //     console.log(response[i].name);
    //     console.log(response[i].email);
    //     console.log(response[i].phoneNumber);
    //     mobileLast3Digits = String(response[i]?.phoneNumber).substr(String(response[i]?.phoneNumber).length - 3)
    //     password = `${response[i]?.email.split('@')[0]}${mobileLast3Digits}`
    // email_response = await custom_mail(response[i], password)
    let result = await axios.post(
      `https://smsapi.interpayafrica.com/Api/SendSMS`,
      {
        recipients: [`919081021652`],
        msgText: `Welcome to Aizawl - The Resource & Learning Centre for TM1`,
        smsSender: "Aizawl",
        userName: "PANAFADMIN",
        appKey: "hU3tg59^rebdVFAl",
      }
    );
    console.log(result);

    console.log("sms send");
    // }
    return res
      .status(200)
      .json(new apiResponse(200, "Testing successfully done!", {}, {}));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new apiResponse(500, "Internal Server Error", {}, error));
  }
};

export const sendSMSTest = async (req: Request, res: Response) => {
  reqInfo(req);
  try {
    await sendSMS(91, 9925589774, SMSTemplate?.registration(992558));
    return res
      .status(200)
      .json(new apiResponse(200, "Testing successfully done!", {}, {}));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new apiResponse(500, "Internal Server Error", {}, error));
  }
};

export const temp_testing_sms = async (req: Request, res: Response) => {
  reqInfo(req);
  try {
    // var options = {
    //     'method': 'POST',
    //     'hostname': '6j63ez.api.infobip.com',
    //     'path': '/sms/2/text/advanced',
    //     'headers': {
    //         'Authorization': 'App 55337b71a9b11866f9df55eb6fa8b535-edb780b6-b89c-4a9d-8f4e-330dee217495',
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json'
    //     },
    // };

    // var abc = https.request(options, function (resp) {
    //     var chunks = [];

    //     resp.on("data", function (chunk) {
    //         chunks.push(chunk);
    //     });

    //     resp.on("end", function (chunk) {
    //         var body = Buffer.concat(chunks);
    //         console.log(body.toString());
    //     });

    //     resp.on("error", function (error) {
    //         console.error(error);
    //     });
    // });

    // var postData = JSON.stringify({
    //     "messages": [
    //         {
    //             "destinations": [
    //                 {
    //                     "to": "+233243057533"
    //                 }
    //             ],
    //             "from": "InfoSMS",
    //             "text": "This is a sample message for testing KATOn"
    //         }
    //     ]
    // });
    // abc.write(postData);
    // abc.end();
    var options = {
      method: "POST",
      hostname: "6j63ez.api.infobip.com",
      path: "/sms/2/text/advanced",
      headers: {
        Authorization:
          "App 55337b71a9b11866f9df55eb6fa8b535-edb780b6-b89c-4a9d-8f4e-330dee217495",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    var abc = https.request(options, function (resp) {
      var chunks = [];
      resp.on("data", function (chunk) {
        chunks.push(chunk);
      });
      resp.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
      });
      resp.on("error", function (error) {
        console.error(error);
      });
    });
    var postData = JSON.stringify({
      messages: [
        {
          destinations: [
            {
              to: "233243057533",
            },
          ],
          from: "Aizawl",
          text: "This is a sample message for testing Infobip SMS for KATOn",
        },
      ],
    });
    abc.write(postData);
    abc.end();
    return res
      .status(200)
      .json(new apiResponse(200, "Testing successfully doneeee!", {}, {}));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new apiResponse(500, "Internal Server Error", {}, error));
  }
};

export const temp_testing_sms_v1 = async (req: Request, res: Response) => {
  reqInfo(req);
  try {
    // const infobip = new InfoBip("23285b9ebe6ce8bec7515db68bfd89d1-8dd1ff39-bf63-453b-92e7-ac634d531032", {
    //     // authType: 'basic',
    //     username: 'janki', // Infobip Username used for registration
    //     password: '123@Abc123', // Infobip Password used for registration
    //     encrypted: false,
    //     baseHost: 'mpzl12.api.infobip.com/'
    // })

    // /*
    //   Send SMS to two mobile numbers

    //   - NB: make sure the Sender ID is registred with infobip before use
    // */
    // const promise = infobip.sendSMS({
    //     messages: [{
    //         from: "InfoSMS", // Sender ID
    //         destinations: [
    //             { to: '+919081021652' },
    //         ],
    //         text: 'Dear Customer, Thanks for registering with our service.'
    //     }],
    // })

    // promise.then(response => {
    //     const { body } = response
    //     console.log('response body: ', body)
    // }).catch(error => {
    //     console.error(error)
    // })
    let result: any = await axios
      .post(
        `https://6j63ez.api.infobip.com/sms/2/text/advanced`,
        JSON.stringify({
          messages: [
            {
              destinations: [
                {
                  to: `233243057533`,
                },
              ],
              from: `Aizawl`,
              text: "Dear Customer, Thanks for registering with our service",
            },
          ],
        }),
        {
          headers: {
            Authorization: `App 55337b71a9b11866f9df55eb6fa8b535-edb780b6-b89c-4a9d-8f4e-330dee217495`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .catch((error) => {
        console.log(error);
        return false;
      });
    return res
      .status(200)
      .json(new apiResponse(200, "Testing successfully doneeee!", {}, {}));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new apiResponse(500, "Internal Server Error", {}, error));
  }
};

export const temp_testing_delete = async (req: Request, res: Response) => {
  reqInfo(req);
  // let skip: any = 0, limit: any = 1, response: any, email_response: any, mobileLast3Digits: any, password: any,
  //     optionTypeArray: any = ["Recorded Online Training", "Live Training Session", "Physical Training"]
  let start_limit: any = 15000,
    end_limit: any = 20000,
    response: any,
    email_response: any,
    mobileLast3Digits: any,
    passwordHash: any,
    email: any,
    password: any,
    skip: any = 0,
    limit: any = 330,
    optionTypeArray: any = [
      "Recorded Online Training",
      "Live Training Session",
      "Physical Training",
    ];
  try {
    response = await userModel.aggregate([
      { $match: { isActive: false } },
      { $sort: { createdAt: -1 } },
      // {
      //     $match: {
      //         isActive: true, userType: 0, createdAt: {
      //             $gte: new Date("2021-11-22"),
      //             $lte: new Date(new Date("2021-11-22").setDate(new Date("2021-11-22").getDate() + 1)),
      //         }
      //     }
      // },

      // { $sort: { createdAt: -1 } },
    ]);
    console.log(response);
    console.log(response.length);

    for (let i = 0; i < response?.length; i++) {
      console.log(response[i].name);
      console.log(response[i].email);
      console.log(response[i].phoneNumber);

      let deleteUser = await userModel.findByIdAndDelete({
        _id: ObjectId(response[i]._id),
      });

      let deleteTraining = await training_optionModel.findOneAndDelete([
        { $match: { createdBy: ObjectId(response[i]._id) } },
      ]);
    }
    return res
      .status(200)
      .json(new apiResponse(200, "Testing successfully done!", response, {}));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new apiResponse(500, "Internal Server Error", {}, error));
  }
};

export const temp_delete_user = async (req: Request, res: Response) => {
  reqInfo(req);
  try {
    let result = await userModel.updateMany(
      { isActive: true },
      { isEmailVerified: true, isPhoneVerified: true }
    );
    return res
      .status(200)
      .json(new apiResponse(200, "Testing successfully done!", {}, {}));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new apiResponse(500, "Internal Server Error", {}, error));
  }
};

export const temp_add_school = async (req: Request, res: Response) => {
  reqInfo(req);
  // let skip: any = 0, limit: any = 1, response: any, email_response: any, mobileLast3Digits: any, password: any,
  //     optionTypeArray: any = ["Recorded Online Training", "Live Training Session", "Physical Training"]
  let start_limit: any = 15000,
    end_limit: any = 20000,
    response: any,
    email_response: any,
    mobileLast3Digits: any,
    passwordHash: any,
    email: any,
    password: any,
    skip: any = 19999,
    limit: any = 20000,
    optionTypeArray: any = [
      "Recorded Online Training",
      "Live Training Session",
      "Physical Training",
    ];
  try {
    response = await userModel.aggregate([
      { $match: { isActive: true, userType: 0 } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);
    for (let i = 0; i < response?.length; i++) {
      console.log(response[i].email);
      console.log(response[i].phoneNumber);
      console.log(response[i].schoolName);
      console.log(i);
      if (response[i]?.schoolName != null || response[i]?.schoolName != "") {
        let findSchool = await schoolModel.findOne({
          name: response[i]?.schoolName,
        });
        if (!findSchool) {
          let addSchool = await new schoolModel({
            name: response[i]?.schoolName,
            createdBy: ObjectId("618e69f83314ee4398fd3bd8"),
          })
            .save()
            .then((data) => {
              return data;
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
    }
    return res
      .status(200)
      .json(new apiResponse(200, "Testing successfully done!", response, {}));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new apiResponse(500, "Internal Server Error", {}, error));
  }
};

// export const temp_testing_v2 = async (req: Request, res: Response) => {
//     reqInfo(req)
//     // let skip: any = 0, limit: any = 1, response: any, email_response: any, mobileLast3Digits: any, password: any,
//     //     optionTypeArray: any = ["Recorded Online Training", "Live Training Session", "Physical Training"]
//     let start_limit: any = 15000, end_limit: any = 20000, response: any, email_response: any, mobileLast3Digits: any, passwordHash: any, email: any, password: any, skip: any = 0, limit: any = 1000,
//         optionTypeArray: any = ["Recorded Online Training", "Live Training Session", "Physical Training"]
//     try {
//         response = await userModel.aggregate([
//             { $match: { isActive: true, userType: 0, } },
//             { $sort: { createdAt: -1 } },
//             { $skip: skip },
//             { $limit: limit }
//         ])
//         for (let i = 0; i < response?.length; i++) {
//             console.log(i)
//             console.log(response[i].name);
//             console.log(response[i].email);
//             mobileLast3Digits = String(response[i]?.phoneNumber).substr(String(response[i]?.phoneNumber).length - 3)
//             password = `${response[i]?.email.split('@')[0]}${mobileLast3Digits}`
//             email_response = await custom_mail(response[i], password)
//             await axios.post(`${SMS?.URL}`, {
//                 "recipients": [
//                     `${response[i]?.countryCode}${response[i]?.phoneNumber}`,
//                 ],
//                 "msgText": `Welcome to Aizawl - The Resource & Learning Centre for TM1
//             https://katon.katechnologiesgh.com
//             Login details:
//             Email: ${response[i].email}
//             Passwd: ${password}`,
//                 "smsSender": SMS?.smsSender,
//                 "userName": SMS?.userName,
//                 "appKey": SMS?.appKey
//             })
//         }
//         // const salt = await bcryptjs.genSaltSync(10);
//         // for (let i = start_limit; i < end_limit; i++) {
//         //     mobileLast3Digits = String(userData[i]?.mobile).substr(String(userData[i]?.mobile).length - 3)
//         //     email = userData[i]?.email.split('@')[0].toLowerCase()
//         //     email = email.replace("�", "")
//         //     passwordHash = await bcryptjs.hash(`${email}${mobileLast3Digits}`, salt)
//         //     console.log(`Count: ${i}\nEmail: ${email}\nPassword: ${email}${mobileLast3Digits}`)
//         //     response = await new userModel({
//         //         name: (String(userData[i]?.firstName) as string).charAt(0).toUpperCase() + (String(userData[i]?.firstName) as string).slice(1).toLowerCase() + " " + (userData[i]?.lastName as any).charAt(0).toUpperCase() + (userData[i]?.lastName as any).slice(1).toLowerCase(),
//         //         region: (userData[i]?.region as any).charAt(0).toUpperCase() + (userData[i]?.region as any).slice(1).toLowerCase(),
//         //         city: (userData[i]?.district as any).charAt(0).toUpperCase() + (userData[i]?.district as any).slice(1).toLowerCase(),
//         //         schoolName: (userData[i]?.school as any).charAt(0).toUpperCase() + (userData[i]?.school as any).slice(1).toLowerCase(),
//         //         email: userData[i]?.email.toLowerCase(),
//         //         teacherID: userData[i]?.teacherID,
//         //         phoneNumber: String(userData[i]?.mobile).slice(3),
//         //         countryCode: "233",
//         //         country: "Ghana",
//         //         isEmailVerified: true,
//         //         isPhoneVerified: true,
//         //         password: passwordHash,
//         //     }).save().then(data => { return data }).catch(error => { console.log(error) })
//         //     if (response) {
//         //         await new training_optionModel({
//         //             optionType: optionTypeArray.indexOf(userData[i]?.trainingOption),
//         //             subjectId: ObjectId("61648f4bfa12f00e6b9d8036"),
//         //             createdBy: ObjectId(response?._id)
//         //         }).save()
//         //     }
//         // }
//         return res.status(200).json(new apiResponse(200, 'Testing successfully done!', response, {}))
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json(new apiResponse(500, "Internal Server Error", {}, error))
//     }
// }

// export const invoice_testing = async (req: Request, res: Response) => {
//     reqInfo(req)
//     let filename = 'edute.pdf'
//     let html = `<!DOCTYPE html>
//     <html lang="en">

//     <head>
//         <meta charset="UTF-8">
//         <meta http-equiv="X-UA-Compatible" content="IE=edge">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <link rel="preconnect" href="https://fonts.googleapis.com">
//         <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
//         <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
//         <title>id card

//         </title>
//         <style>
//             html {
//                 height: 100%;
//                 font-family: Roboto;
//             }

//             h1,
//             h2 {

//                 margin: 0px 0px 0px 0px;
//             }

//             h1 {
//                 font-size: 24px;
//             }

//             h2 {
//                 font-size: 16px;
//             }

//             p {
//                 margin: 0px;
//             }

//             .profile-card {
//                 margin-left: -30px;
//                 height: 90%;
//                 text-align: center;
//                 width: 80%;
//                 border: 1px solid;
//                 margin-top: 5px;
//                 border-radius: 15px;
//                 box-shadow: 0px 3px 6px rgb(0 0 0 / 16%), 0px 3px 6px rgb(0 0 0 / 23%);
//             }
//             .profile-card2 {
//                 margin-left: -30px;
//                 height: 90%;
//                 text-align: center;
//                 width: 77.5%;
//                 padding: 5px;
//                 border: 1px solid;
//                 margin-top: 5px;
//                 border-radius: 15px;
//                 box-shadow: 0px 3px 6px rgb(0 0 0 / 16%), 0px 3px 6px rgb(0 0 0 / 23%);
//             }

//             .profile-card header {
//                 width: 179px;
//                 height: 280px;
//                 padding: 40px 20px 30px 20px;
//                 display: inline-block;
//                 float: left;
//                 border-right: 2px dashed #EEEEEE;
//                 background: #FFFFFF;
//                 color: #000000;
//                 margin-top: 10px;

//                 text-align: center;

//             }

//             .profile-card a {
//                 display: inline-block;
//                 text-align: center;
//                 position: relative;
//                 margin: 2px 30px;
//             }

//             .profile-card a:after {
//                 position: absolute;
//                 content: "";
//                 bottom: 3px;
//                 right: 3px;
//                 width: 20px;
//                 height: 20px;

//             }

//             .profile-card a>img {
//                 width: 120px;

//                 max-width: 100%;

//             }

//             .profile-card a>img {
//                 width: 120px;

//                 max-width: 100%;

//             }

//             .center {
//                 margin-left: 150px;
//             }

//             .profile {
//                 width: 70px;
//                 height: 124px !important;
//                 max-width: 100%;
//             }

//             b {
//                 font-size: 14px;
//             }

//             h1 {
//                 font-size: 20px;
//             }

//             h2 {
//                 font-size: 18px;
//             }

//             p {
//                 font-size: 14px;
//             }
//             .profile-card2 p{
//                 padding-top: 0px  !important;
//                 padding-bottom: 0px  !important;
//                 padding-right: 0px  !important;
//                 padding-left: 10px  !important;

//                 font-size: 12px !important;
//             }
//             .bordered{
//                 height: 20px;
//                 margin-top: 6px;
//                 background-color: rgba(118, 88, 248, 1);
//                 border-top : 5px solid rgb(255, 136, 0);
//                 border-bottom-left-radius: 15px;
//                 border-bottom-right-radius: 15px;
//             }
//         </style>
//     </head>

//     <body>

//         <div class="center">
//             <div class="profile-card">
//                 <div style="display: flex; flex-direction: column; margin-bottom: 20px;">
//                     <div>
//                         <img src="https://edutech-mlm.s3.ap-south-1.amazonaws.com/logo11.jpg" width="150px;"
//                             style="margin-top: 15px; margin-bottom: 15px;" />
//                     </div>
//                     <div>
//                         <img src="https://edutech-mlm.s3.ap-south-1.amazonaws.com/5/db557051-6e57-4be9-9a9f-a92d5996ea84.jpg"
//                             width="130px;" height="170px;"
//                             style="margin-top:10px; border-top: 2px solid; border-bottom: 1px solid; border-left: 2px solid; border-right: 1px solid; border-radius: 10px;" />
//                     </div>
//                 </div>

//                 <h1 style='margin-bottom: 10px;'>
//                     Better Visuals
//                 </h1>
//                 <div class="profile-bio">

//                     <p>
//                         <b>Emp. ID: hdgfhdgfh</b></br>
//                         <b>Blood Group : dfgh</b></br>
//                         <b>Contact No : 456456456456</b></br>
//                     </p>

//                 </div>
//                 <div class='bordered'>
//                 </div>

//             </div>
//             <div class="profile-card2" >
//                 <h2>
//                     <div style="float: left; font-size: 13px; margin-top: 15px; padding-left:10px;">Instructions: </div></br>
//                 </h2>

//                 <div class="profile-bio" style="text-align: left !important; font-size: 13px; margin-top: 20px;">

//                        <p>
//                        1. The Employee shall carry the ID Card while on duty & produce the same on demand
//                        by security &
//                        concerned
//                        authorities.
//                        </p></br>
//                        <p>
//                        2. This card is not transferable & must be surrendered at the time of leaving the
//                        company.
//                        </p></br>
//                        <p>
//                        3. In case of loss/damage, cost of additional card wille be borne by the
//                        employee.
//                        </p></br>
//                         <p>
//                         4. Loss of this card should be immediately reported to the below contact.
//                         </p></br>
//                     <h2>
//                         <div
//                             style="float: center; font-size: 14px; border: 1px solid rgba(118, 88, 248, 1); text-align : center;">
//                             Emergency Contact
//                             No.:
//                             9564575757</div></br>
//                     </h2>
//                     <div
//                         style="text-align: center !important; font-size: 11px; color: rgb(255, 136, 0); margin-top: -10px; margin-bottom: -10px;">
//                         If
//                         found please return to: </div></br>

//                     <div style="text-align: center !important;">

//                         <img src="https://edutech-mlm.s3.ap-south-1.amazonaws.com/logo11.jpg" width="108px;" />

//                         </br></br>

//                         <h1 style="margin-top: -20px; color: #002245db;">
//                             NKCL </br>
//                         </h1>
//                         <h2 style="color: rgba(118, 88, 248, 1);">
//                             Eduteck Private Limited
//                         </h2>
//                     </div>
//                     <div style="text-align: center !important;">
//                         <b>Email Id : </b></br>
//                         enquiry@edu-teck.com
//                     </div>

//                 </div>
//             </div>
//         </div>
//     </body>

//     </html>`
//     try {
//         await pdf.create({
//             html: html,
//             data: {
//                 details: []
//             },
//             path: './' + filename
//         }, {
//             orientation: "portrait",
//             format: "A4",
//         })
//             .then(res => {
//                 return res
//             }).catch(error => {
//                 console.log(error)
//             })

//         let location = await upload_all_type({
//             data: fs.readFileSync(process.cwd() + `/${filename}`),
//             name: filename,
//             mimetype: 'application/pdf'
//         }, 'eduteckkkkk')
//         fs.unlinkSync(process.cwd() + `/${filename}`)
//         return res.status(200).json(new apiResponse(200, 'Testing successfully done!', { location }, {}))
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json(new apiResponse(500, "Internal Server Error", {}, error))
//     }
// }

export const invoice_testing = async (req: Request, res: Response) => {
  reqInfo(req);
  let filename = "invoicegenerate.pdf";
  let html = `<!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice</title>
    </head>

    <body style="margin:0;">
        <style>
            .table1 {
                font-family: arial, sans-serif;
                border-collapse: collapse;
                width: 100%;
            }

            th {
                border: 1px solid #000000;
                text-align: left;
                padding: 8px 8px 8px 3px;
                font-size: 8px;
                background-color: #dddddd;
            }

            .td1 {
                text-align: left;
                border-left: 1px solid #000000;
                text-align: center;
                font-size: 8px;
                padding: 6px 6px 6px 3px;
            }

            .td2 {
                text-align: left;
                border: 1px solid #000000;
                font-size: 8px;
                padding: 6px 6px 6px 3px;
            }
        </style>
        <table
            style="font-family: arial; max-width: 800px; width: 100%; height: 100%; margin-left: auto; margin-right: auto; margin-top: 9px; padding:3px 1px; font-size: 11px; border:1px solid #000000;">
            <tr>
                <td style=" padding-bottom:4px; text-align: center;" colspan="2">
                    <span id=" _26.5" style="font-weight:bold; font-family:Arial;  font-size:12.5px; color:#000000">
                        TAX INVOICE</span>
                </td>
            </tr>
            <tr>
                <td style="padding-top:15px;">
                    <table>
                        <tr>
                            <td>
                                <span id=" _12.9"
                                    style="font-weight:bold; font-family:Arial;  font-size:8px; color:#000000">
                                    INVOICE NO. </span>
                            </td>
                            <td>
                            <td>
                                <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                                    : NKCL/2022/0001056</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span id=" _12.9"
                                    style="font-weight:bold; font-family:Arial;  font-size:8px; color:#000000">
                                    DATED </span>
                            </td>
                            <td>
                            <td>
                                <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                                    : 01/02/2022</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span id=" _12.9"
                                    style="font-weight:bold; font-family:Arial;  font-size:8px; color:#000000">
                                    ORDER NO. </span>
                            </td>
                            <td>
                            <td>
                                <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                                    : a1b6a39b9305f2a4d1c13bef03dbe7d5</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span id=" _12.9"
                                    style="font-weight:bold; font-family:Arial;  font-size:8px; color:#000000">
                                    ORDER DATE. </span>
                            </td>
                            <td>
                            <td>
                                <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                                    : 01/02/2022</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span id=" _12.9"
                                    style="font-weight:bold; font-family:Arial;  font-size:8px; color:#000000">
                                    CHANNEL </span>
                            </td>
                            <td>
                            <td>
                                <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                                    : Custom</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span id=" _12.9"
                                    style="font-weight:bold; font-family:Arial;  font-size:8px; color:#000000">
                                    SHIPPED BY </span>
                            </td>
                            <td>
                            <td>
                                <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                                    : Ecom Express</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span id=" _12.9"
                                    style="font-weight:bold; font-family:Arial;  font-size:8px; color:#000000">
                                    PAYMENT METHOD </span>
                            </td>
                            <td>
                            <td>
                                <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                                    : Prepaid</span>
                            </td>
                        </tr>
                    </table>

                </td>
                <td style="padding-top:15px">
                    <table>
                        <tr>
                            <td>
                                <span id=" _12.9" style="font-weight:bold; font-family:Arial; font-size:8px; color:#000000">
                                    NKCL EDUTECK PRIVATE LIMITED</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                                    Flat no. 1 & 2 Baghyashree Vihar Co op Society </span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                                    Behind Naivedyam Hotel Mitramandal Chowk Parvati </span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                                    Pune, Maharashtra - 411005</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                                    GSTN-</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                                    CIN: U74999PN2016PTC167304 </span>
                            </td>
                        </tr>

                    </table>

                </td>

            </tr>
            <!--------------------------------------------                            TABLE 2 START                             ----------------------------------------->
            <tr>
                <td style="padding-top:15px">
                    <table>
                        <tr>
                            <td colspan="2">
                                <span id=" _12.9" style="font-weight:bold; font-family:Arial; font-size:8px; color:#000000">
                                    Billed to/ Shipped to</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                                    Name</span>
                            </td>
                            <td style='padding-left: 20px;'>
                                <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                                    KISHOR UKANDI KHIRADE</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                                    Address</span>
                            </td>
                            <td style='padding-left: 20px;'>
                                <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                                    At post - Kawtha khurd.Tal- Risod.Dist- Washim</span>
                            </td>
                        </tr>
                        <tr>
                            <td>

                            </td>
                            <td style='padding-left: 20px;'>
                                <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                                    At post - Kawtha khurd.Tal- Risod.Dist- Washim</span>
                            </td>
                        </tr>
                        <tr>
                            <td>

                            </td>
                            <td style='padding-left: 20px;'>
                                <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                                    Risod - 444506</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                                    State</span>
                            </td>
                            <td style='padding-left: 20px;'>
                                <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                                    Maharashtra</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                                    State Code</span>
                            </td>
                            <td style='padding-left: 20px;'>
                                <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                                    27</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                                    GSTIN</span>
                            </td>
                            <td style='padding-left: 20px;'>
                                <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                                </span>
                            </td>
                        </tr>


                    </table>

                </td>
                <td style="padding-top:15px">
                    <table>
                        <tr>
                            <td colspan="2">
                                <span id=" _12.9" style="font-weight:bold; font-family:Arial; font-size:8px; color:#000000">
                                    Shipped By/ From</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                                    Name</span>
                            </td>
                            <td style='padding-left: 20px;'>
                                <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                                    Asestore Private Limited</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                                    Address</span>
                            </td>
                            <td style='padding-left: 20px;'>
                                <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                                    Warehouse: Gala No. 6, Ground Floor,
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td>

                            </td>
                            <td style='padding-left: 20px;'>
                                <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                                    Rajlaxmi Complex, Kaher Bhiwandi,
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td>

                            </td>
                            <td style='padding-left: 20px;'>
                                <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                                    Thane 421302
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                                    State</span>
                            </td>
                            <td style='padding-left: 20px;'>
                                <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                                    Maharashtra</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                                    State Code</span>
                            </td>
                            <td style='padding-left: 20px;'>
                                <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                                    27</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                                    GSTIN</span>
                            </td>
                            <td style='padding-left: 20px;'>
                                <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                                    27AAFCB7273E1ZN</span>
                            </td>
                        </tr>

                    </table>

                </td>
            </tr>
            <!--------------------------------------------                            TABLE 3 START                             ----------------------------------------->
            <tr>
                <td style=" width: 65%; padding-top:3px;" colspan="2">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <th style="text-align: center;">Code #</th>
                            <th style="text-align: center;">Description of Goods</th>
                            <th style="text-align: center;">STD</th>
                            <th style="text-align: center; padding: 0px 3px;">MRP</th>
                            <th style="text-align: center;">HSN/SAC</th>
                            <th style="text-align: center;">Quantity</th>
                            <th style="text-align: center;">Rate</th>
                            <th style="text-align: center;border-left: 1px solid #000000;">Total Taxable Value</th>
                        </tr>

                <tr>
                <td class="td1" style="border-bottom: 1px solid #000000;">FFQ120</td>
                <td class="td1" style="border-bottom: 1px solid #000000;">1th Supplementary</td>
                <td class="td1" style="border-bottom: 1px solid #000000;">1</td>
                <td class="td1" style="border-bottom: 1px solid #000000;">5499</td>
                <td class="td1" style="border-bottom: 1px solid #000000;">49011010</td>
                <td class="td1" style="border-bottom: 1px solid #000000;">1</td>
                <td class="td1" style="border-bottom: 1px solid #000000;">5499</td>
                <td class="td1" style="border-right: 1px solid #000000; border-bottom: 1px solid #000000;">
                    5499</td>
            </tr>

                        <tr>
                            <td class="td1" colspan="2"></td>
                            <td class="td1"></td>
                            <td class="td1"></td>
                            <td class="td1"></td>
                            <td class="td1"></td>
                            <td class="td1"></td>
                            <td class="td1" style="border-right: 1px solid #000000;"></td>
                        </tr>
                        <tr>
                            <td class="td1" colspan="2"></td>
                            <td class="td1"></td>
                            <td class="td1"></td>
                            <td class="td1">Output CGST</td>
                            <td class="td1"></td>
                            <td class="td1">0%</td>
                            <td class="td1" style="border-right: 1px solid #000000;">-</td>
                        </tr>
                        <tr>
                            <td class="td1" style="border-bottom: 1px solid #000000;" colspan="2"></td>
                            <td class="td1" style="border-bottom: 1px solid #000000;"></td>
                            <td class="td1" style="border-bottom: 1px solid #000000;"></td>
                            <td class="td1" style="border-bottom: 1px solid #000000;">Output SGST</td>
                            <td class="td1" style="border-bottom: 1px solid #000000;"></td>
                            <td class="td1" style="border-bottom: 1px solid #000000;">0%</td>
                            <td class="td1" style="border-right: 1px solid #000000; border-bottom: 1px solid #000000;">-
                            </td>
                        </tr>
                        <tr>
                            <td class="td1" style="border-bottom: 1px solid #000000; font-weight:bold;">Total</td>
                            <td class="td1" style="border-bottom: 1px solid #000000; font-weight:bold;">
                                1 (Set)</td>
                            <td class="td1" style="border-bottom: 1px solid #000000;"></td>
                            <td class="td1" style="border-bottom: 1px solid #000000; font-weight:bold;">5499</td>
                            <td class="td1" style="border-bottom: 1px solid #000000;"></td>
                            <td class="td1" style="border-bottom: 1px solid #000000;font-weight:bold;">
                                1</td>
                            <td class="td1" style="border-bottom: 1px solid #000000; "></td>
                            <td class="td1"
                                style="border-right: 1px solid #000000; border-bottom: 1px solid #000000; font-weight:bold;">
                                5499
                            </td>
                        </tr>
                        <tr>
                            <td class="td1" style=" font-weight:bold; text-align: left;" colspan="7">Amount Chargeable (in
                                words)</td>
                            <td
                                style="border-right: 1px solid #000000;  font-weight:bold; text-align: right; padding-right: 7px;">
                                E.& O.E.
                            </td>
                        </tr>
                        <tr>
                            <td class="td1"
                                style="border-bottom: 1px solid #000000; font-weight:bold; text-align: left;border-left: 1px solid #000000;font-size: 8px;"
                                colspan="7">INR Five Thousand Four Hundred And Ninety Nine  Only</td>
                            <td
                                style="border-right: 1px solid #000000; border-bottom: 1px solid #000000; font-weight:bold;">
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td>
                    <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                        Tax Amount (in words) : INR NIL</span>
                </td>
            </tr>
            <tr>
                <td>
                    <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                        Declaration:- GST Under HSN Code 49011010 on Printed Books is NIL
                    </span>
                </td>
            </tr>
            <tr>
                <td style=" width: 65%; padding-top:3px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="text-decoration: underline; font-weight: bold;">
                                <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                                    Declaration
                                </span>
                            </td>

                        </tr>
                        <tr>
                            <td colspan="2">
                                <span id=" _12.9" style="font-family:Arial; font-size:8px; color:#000000;">
                                    We declare that this invoice shows the actual price of the goods described and
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td><span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000">
                                    that all particular are true and correct.
                                </span>
                            </td>

                        </tr>
                        <tr>
                            <td>

                            </td>

                        </tr>
                    </table>
                </td>
                <td>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td
                                style="border-top:1px solid #000000; border-right:1px solid #000000; border-left:1px solid #000000; font-weight: bold; text-align: end; padding-left: 20px;">   
                                <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000;">
                                    For NKCL EDUTECK PRIVATE LIMITED
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td style="border-right:1px solid #000000; border-left:1px solid #000000; text-align: right;">
                                <img class="img-fluid" width="100px" height="35px"
                                    src='https://edutech-mlm.s3.ap-south-1.amazonaws.com/sing.jpeg'>
                            </td>
                        </tr>
                        <tr>
                            <td
                                style="border-bottom:1px solid #000000;  border-right:1px solid #000000; border-left:1px solid #000000; font-weight: bold; text-align: end; padding-left: 20px;">
                                <span id=" _12.9" style=" font-family:Arial; font-size:8px; color:#000000;">
                                    Authorized Signatory
                                </span>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>

    </html>`;
  try {
    await pdf
      .create(
        {
          html: html,
          data: {
            details: [],
          },
          path: "./" + filename,
        },
        {
          orientation: "portrait",
          format: "A4",
        }
      )
      .then((res) => {
        return res;
      })
      .catch((error) => {
        console.log(error);
      });

    let location = await upload_all_type(
      {
        data: fs.readFileSync(process.cwd() + `/${filename}`),
        name: filename,
        mimetype: "application/pdf",
      },
      "invoice"
    );
    fs.unlinkSync(process.cwd() + `/${filename}`);
    return res
      .status(200)
      .json(
        new apiResponse(200, "Testing successfully done!", { location }, {})
      );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new apiResponse(500, "Internal Server Error", {}, error));
  }
};
