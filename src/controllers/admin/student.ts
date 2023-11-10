"use strict";
import { reqInfo } from "../../helpers/winston_logger";
import {
  userModel,
  answerModel,
  resultModel,
  training_optionModel,
  video_training_logModel,
} from "../../database";
import { apiResponse, userStatus } from "../../common";
import { Request, Response } from "express";
import { email_approved } from "../../helpers/mail";
import { pdf_generation } from "../../helpers/pdf_generate";
import moment from "moment";

const ObjectId = require("mongoose").Types.ObjectId;

export const get_student = async (req: Request, res: Response) => {
  reqInfo(req);
  try {
    let response = await userModel
      .find(
        { userType: userStatus.student, isActive: true },
        {
          _id: 1,
          name: 1,
          email: 1,
          phoneNumber: 1,
          schoolId: 1,
          alter_email: 1,
          alter_phoneNumber: 1,
          image: 1,
          schoolName: 1,
          address: 1,
          country: 1,
          region: 1,
          city: 1,
          countryCode: 1,
          registeredDate: 1,
          createdAt: 1,
        }
      )
      .sort({ createdAt: -1 });
    if (response)
      return res
        .status(200)
        .json(new apiResponse(200, "Get student successfully", response, {}));
    else
      return res
        .status(400)
        .json(
          new apiResponse(
            400,
            "Database error while getting student details ",
            {},
            {}
          )
        );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new apiResponse(500, "Internal server error", {}, error));
  }
};

export const get_by_student = async (req: Request, res: Response) => {
  reqInfo(req);
  try {
    let response = await userModel.findOne(
      {
        _id: ObjectId(req.params.id),
        isActive: true,
        userType: userStatus.student,
      },
      {
        name: 1,
        email: 1,
        phoneNumber: 1,
        alter_phoneNumber: 1,
        image: 1,
        accountType: 1,
        schoolId: 1,
      }
    );
    if (response)
      return res
        .status(200)
        .json(new apiResponse(200, "Student", response, {}));
    else
      return res
        .status(400)
        .json(new apiResponse(400, "Database error", {}, {}));
  } catch (error) {
    return res
      .status(500)
      .json(new apiResponse(500, "Internal server error", {}, {}));
  }
};

export const get_filter_student = async (req: Request, res: Response) => {
  reqInfo(req);
  let user: any = req.header("user"),
    { _id, search, limit, page, ascending } = req.body,
    skip = 0,
    response: any = {},
    match: any = {},
    sort: any = {};
  limit = parseInt(limit);
  skip = (parseInt(page) - 1) * parseInt(limit);
  try {
    // Database Filtering
    if (_id?.length != 0 && _id !== undefined) {
      _id.forEach(function (part, index, theArray) {
        theArray[index] = ObjectId(String(part));
      });
      match["_id"] = { $in: _id };
    }
    if (search) {
      var nameArray: Array<any> = [];
      var emailArray: Array<any> = [];
      var alter_emailArray: Array<any> = [];
      var phoneNumberArray: Array<any> = [];
      var alter_phoneNumberArray: Array<any> = [];
      search = search.split(" ");
      search.forEach((data) => {
        nameArray.push({ name: { $regex: data, $options: "si" } });
        emailArray.push({ email: { $regex: data, $options: "si" } });
        phoneNumberArray.push({
          phoneNumber: { $regex: data, $options: "si" },
        });
        alter_emailArray.push({
          alter_email: { $regex: data, $options: "si" },
        });
        alter_phoneNumberArray.push({
          alter_phoneNumber: { $regex: data, $options: "si" },
        });
      });
      match.$or = [
        { $and: nameArray },
        { $and: emailArray },
        { $and: phoneNumberArray },
        { $and: alter_emailArray },
        { $and: alter_phoneNumberArray },
      ];
    }
    match.isActive = true;
    match.userType = userStatus.student;
    match.isEmailVerified = true;
    match.isPhoneVerified = true;
    // Sorting Database
    sort.createdAt = -1;
    if (ascending) sort.createdAt = 1;

    let student_data = await userModel.aggregate([
      { $match: match },
      {
        $facet: {
          user: [
            { $sort: sort },
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                _id: 1,
                name: 1,
                email: 1,
                alter_email: 1,
                alter_phoneNumber: 1,
                phoneNumber: 1,
                image: 1,
                schoolName: 1,
                address: 1,
                country: 1,
                region: 1,
                city: 1,
                countryCode: 1,
                registeredDate: 1,
                createdAt: 1,
              },
            },
          ],
          student_count: [{ $count: "count" }],
        },
      },
    ]);
    response.student_data = student_data[0].user || [];
    response.state = {
      page,
      limit,
      page_limit: Math.ceil(student_data[0]?.student_count[0]?.count / limit),
    };
    res
      .status(200)
      .json(
        new apiResponse(200, `Get theory question successfully`, response, {})
      );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new apiResponse(500, "Internal server error", {}, {}));
  }
};

// export const get_student_status = async (req: Request, res: Response) => {
//   reqInfo(req);
//   let { _id, search, limit, page, ascending } = req.body,
//     skip = 0,
//     response: any = {},
//     match: any = {},
//     sort: any = {};
//   limit = parseInt(limit);
//   skip = (parseInt(page) - 1) * parseInt(limit);
//   try {
//     if (_id?.length != 0 && _id !== undefined) {
//       _id.forEach(function (part, index, theArray) {
//         theArray[index] = ObjectId(String(part));
//       });
//       match["_id"] = { $in: _id };
//     }

//     if (search) {
//       var nameArray: Array<any> = [];
//       var emailArray: Array<any> = [];
//       var alter_emailArray: Array<any> = [];
//       var phoneNumberArray: Array<any> = [];
//       search = search.split(" ");
//       search.forEach((data) => {
//         nameArray.push({ name: { $regex: data, $options: "si" } });
//         emailArray.push({ email: { $regex: data, $options: "si" } });
//         alter_emailArray.push({
//           alter_email: { $regex: data, $options: "si" },
//         });
//         phoneNumberArray.push({
//           phoneNumber: { $regex: data, $options: "si" },
//         });
//       });
//       match.$or = [
//         { $and: nameArray },
//         { $and: emailArray },
//         { $and: alter_emailArray },
//         { $and: phoneNumberArray },
//       ];
//     }

//     match.isActive = true;
//     match.userType = userStatus.student;

//     // Sorting Database
//     sort.createdAt = -1;
//     if (ascending) sort.createdAt = 1;

//     // let response = await userModel.find({ userType: userStatus.student, isActive: true }, { _id: 1, name: 1, email: 1, phoneNumber: 1, schoolId: 1 })
//     let student_data = await userModel.aggregate([
//       { $match: match },
//       {
//         $lookup: {
//           from: "results",
//           let: { createdBy: "$_id" },
//           pipeline: [
//             {
//               $match: {
//                 $expr: {
//                   $and: [
//                     { $eq: ["$createdBy", "$$createdBy"] },
//                     { $eq: ["$isActive", true] },
//                   ],
//                 },
//               },
//             },
//             {
//               $lookup: {
//                 from: "course_subjects",
//                 let: { subjectId: "$subjectId" },
//                 pipeline: [
//                   {
//                     $match: {
//                       $expr: {
//                         $and: [
//                           { $eq: ["$_id", "$$subjectId"] },
//                           { $eq: ["$isActive", true] },
//                         ],
//                       },
//                     },
//                   },
//                   { $project: { name: 1 } },
//                 ],
//                 as: "subject",
//               },
//             },
//           ],
//           as: "result",
//         },
//       },
//       {
//         $lookup: {
//           from: "forms",
//           let: { createdBy: "$_id" },
//           pipeline: [
//             {
//               $match: {
//                 $expr: {
//                   $and: [
//                     { $eq: ["$createdBy", "$$createdBy"] },
//                     { $eq: ["$isActive", true] },
//                   ],
//                 },
//               },
//             },
//           ],
//           as: "documents",
//         },
//       },
//       // { $unwind: { path: "$result" } },
//       {
//         $facet: {
//           student: [
//             { $sort: sort },
//             { $skip: skip },
//             { $limit: limit },
//             {
//               $project: {
//                 _id: 1,
//                 name: 1,
//                 email: 1,
//                 "result.score": 1,
//                 "result.isApprove": 1,
//                 "result._id": 1,
//                 "documents.document_image": 1,
//                 //score: { $first: "$result.score" },
//                 isExam: {
//                   $cond: [
//                     {
//                       $eq: ["$result", []],
//                     },
//                     { $const: false },
//                     true,
//                   ],
//                 },
//                 isDocument: {
//                   $cond: [
//                     {
//                       $eq: ["$documents", []],
//                     },
//                     { $const: false },
//                     true,
//                   ],
//                 },
//                 // isPass: {
//                 //     $cond: [
//                 //         {
//                 //             $gte: ["$result.score", [40]]
//                 //         },
//                 //         { $const: true }, false
//                 //     ]
//                 // }
//               },
//             },
//           ],
//           student_count: [{ $count: "count" }],
//         },
//       },
//     ]);
//     response.student_data = student_data[0].student || [];
//     response.state = {
//       page,
//       limit,
//       page_limit: Math.ceil(student_data[0]?.student_count[0]?.count / limit),
//     };
//     if (response)
//       return res
//         .status(200)
//         .json(new apiResponse(200, "get student successfully", response, {}));
//     else
//       return res
//         .status(400)
//         .json(new apiResponse(400, "database error ", {}, {}));
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .json(new apiResponse(500, "Internal server error", {}, error));
//   }
// };

export const Approve = async (req: Request, res: Response) => {
  reqInfo(req);
  let body = req.body,
    email = body.email;
  // let user: any = req.header("user");
  // body.createdBy = user._id;
  try {
    let response = await resultModel.aggregate([
      { $match: { isActive: true, _id: ObjectId(body.resultId) } },
      {
        $lookup: {
          from: "users",
          let: { createdBy: "$createdBy" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id", "$$createdBy"] },
                    { $eq: ["$isActive", true] },
                  ],
                },
              },
            },
            {
              $project: {
                name: 1,
              },
            },
          ],
          as: "user",
        },
      },
      {
        $lookup: {
          from: "course_subjects",
          let: { subjectId: "$subjectId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id", "$$subjectId"] },
                    { $eq: ["$isActive", true] },
                  ],
                },
              },
            },
            {
              $project: {
                title: 1,
              },
            },
          ],
          as: "subject",
        },
      },
      {
        $project: {
          _id: 1,
          subjectId: 1,
          score: 1,
          test_start_time: 1,
          createdBy: 1,
          certificate: 1,
          createdAt: 1,
          name: { $first: "$user.name" },
          subject_name: { $first: "$subject.title" },
          // isExam: {
          //     $cond: [
          //         {
          //             $eq: ["$result", []]
          //         },
          //         { $const: false }, true
          //     ]
          // },
        },
      },
    ]);
    // if (response[0].subjectId.toString() == ObjectId("61648f4bfa12f00e6b9d8036").toString()) {
    //   await pdf_generation(
    //     {
    //       resultId: response[0]?._id,
    //       name: response[0]?.name,
    //       subject_name: response[0]?.subject_name,
    //       date: moment().format("DD MMM YYYY"),
    //     },
    //     `${response[0]?._id}/pdf`,
    //     true
    //   );
    // } else {
    //   await pdf_generation(
    //     {
    //       resultId: response[0]?._id,
    //       name: response[0]?.name,
    //       subject_name: response[0]?.subject_name,
    //       date: moment().format("DD MMM YYYY"),
    //     },
    //     `${response[0]?._id}/pdf`,
    //     true
    //   );
    // }
    await pdf_generation(
      {
        resultId: response[0]?._id,
        name: response[0]?.name,
        subject_name: response[0]?.subject_name,
        date: moment(response[0]?.createdAt).format("DD MMM YYYY"),
      },
      `${response[0]?._id}/pdf`,
      true
    );
    await resultModel.findOneAndUpdate(
      { _id: ObjectId(response[0]?._id), isActive: true },
      {
        isApprove: true,
        certificate_is_create: true,
        certificate: `${response[0]?._id}/pdf/Certificate_of_Completion.pdf`,
      }
    );

    // console.log(response);
    if (response) {
      let action = email_approved(email);
      return res
        .status(200)
        .json(
          new apiResponse(
            200,
            `Email has been sent to ${email}, kindly follow the instructions`,
            action,
            {}
          )
        );
    } else
      return res.status(400).json(new apiResponse(400, "Result", response, {}));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new apiResponse(500, "Internal server error", {}, error));
  }
};

export const get_student_status = async (req: Request, res: Response) => {
  reqInfo(req);
  let { _id, search, limit, page, ascending } = req.body,
    skip = 0,
    response: any = {},
    match: any = {},
    sort: any = {};
  limit = parseInt(limit);
  skip = (parseInt(page) - 1) * parseInt(limit);

  try {
    if (search) {
      var optionType: Array<any> = [];
      search = search.split(" ");
      search.forEach((data) => {
        optionType.push({ "user.name": { $regex: data, $options: "si" } });
      });
      match.$or = [{ $and: optionType }];
    }

    match.isActive = true;
    sort.createdAt = -1;
    if (ascending) sort.createdAt = 1;

    let student_data_count = await training_optionModel.countDocuments({
      isActive: true,
    });
    let recorded_count = await training_optionModel.countDocuments({
      optionType: 0,
      isActive: true,
    });
    let live_count = await training_optionModel.countDocuments({
      optionType: 1,
      isActive: true,
    });
    let physical_count = await training_optionModel.countDocuments({
      optionType: 2,
      isActive: true,
    });

    let student_data = await training_optionModel.aggregate([
      {
        $lookup: {
          from: "course_subjects",
          let: { subjectId: "$subjectId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id", "$$subjectId"] },
                    { $eq: ["$isActive", true] },
                  ],
                },
              },
            },
          ],
          as: "subject",
        },
      },
      {
        $lookup: {
          from: "results",
          let: { subjectId: "$subjectId", createdBy: "$createdBy" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$subjectId", "$$subjectId"] },
                    { $eq: ["$createdBy", "$$createdBy"] },
                    { $eq: ["$isActive", true] },
                  ],
                },
              },
            },
          ],
          as: "result",
        },
      },
      {
        $lookup: {
          from: "forms",
          let: { subjectId: "$subjectId", createdBy: "$createdBy" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$subjectId", "$$subjectId"] },
                    { $eq: ["$createdBy", "$$createdBy"] },
                    { $eq: ["$isActive", true] },
                  ],
                },
              },
            },
          ],
          as: "documents",
        },
      },
      {
        $lookup: {
          from: "users",
          let: { createdBy: "$createdBy" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id", "$$createdBy"] },
                    { $eq: ["$isActive", true] },
                  ],
                },
              },
            },
          ],
          as: "user",
        },
      },
      { $match: match },
      { $sort: { "result.createdAt": -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          optionType: 1,
          subjectId: 1,
          // "subject.title": 1,
          "result.isApprove": 1,
          "result.createdAt": 1,
          "result._id": 1,
          "result.score": 1,
          "documents.document_image": 1,
          "user._id": 1,
          "user.name": 1,
          "user.email": 1,
          subjectName: { $first: "$subject.title" },
          //score: { $first: "$result.score" },
          isExamGiven: {
            $cond: [
              {
                $eq: ["$result", []],
              },
              { $const: false },
              true,
            ],
          },
          isDocument: {
            $cond: [
              {
                $eq: ["$documents", []],
              },
              { $const: false },
              true,
            ],
          },
          isCourse: {
            $cond: [
              {
                $eq: ["$subject", []],
              },
              { $const: false },
              true,
            ],
          },
          // isPass: {
          //     $cond: [
          //         {
          //             $gte: ["$result.score", [40]]
          //         },
          //         { $const: true }, false
          //     ]
          // }
        },
      },
    ]);
    response.recorded_count = recorded_count;
    response.live_count = live_count;
    response.physical_count = physical_count;
    response.student_data = student_data || [];
    response.state = {
      page,
      limit,
      page_limit: Math.ceil(student_data_count / limit),
    };
    if (response)
      return res
        .status(200)
        .json(new apiResponse(200, "Get student successfully", response, {}));
    else
      return res
        .status(400)
        .json(new apiResponse(400, "Database error ", {}, {}));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new apiResponse(500, "Internal server error", {}, error));
  }
};

// export const get_student_status = async (req: Request, res: Response) => {
//   reqInfo(req);
//   let { _id, search, limit, page, ascending } = req.body,
//     skip = 0,
//     response: any = {},
//     match: any = {},
//     sort: any = {};
//   limit = parseInt(limit);
//   skip = (parseInt(page) - 1) * parseInt(limit);
//   try {
//     if (_id?.length != 0 && _id !== undefined) {
//       _id.forEach(function (part, index, theArray) {
//         theArray[index] = ObjectId(String(part));
//       });
//       match["_id"] = { $in: _id };
//     }

//     if (search) {
//       var optionType: Array<any> = [];
//       // var emailArray: Array<any> = [];
//       // var alter_emailArray: Array<any> = [];
//       // var phoneNumberArray: Array<any> = [];
//       search = search.split(" ");
//       search.forEach((data) => {
//         optionType.push({ "user.name": { $regex: data, $options: "si" } });
//         // emailArray.push({ email: { $regex: data, $options: "si" } });
//         // alter_emailArray.push({
//         //   alter_email: { $regex: data, $options: "si" },
//         // });
//         // phoneNumberArray.push({
//         //   phoneNumber: { $regex: data, $options: "si" },
//         // });
//       });
//       match.$or = [
//         { $and: optionType },
//         // { $and: emailArray },
//         // { $and: alter_emailArray },
//         // { $and: phoneNumberArray },
//       ];
//     }

//     match.isActive = true;
//     //match.userType = userStatus.student

//     // Sorting Database
//     sort.createdAt = -1;
//     if (ascending) sort.createdAt = 1;

//     // let response = await userModel.find({ userType: userStatus.student, isActive: true }, { _id: 1, name: 1, email: 1, phoneNumber: 1, schoolId: 1 })
//     // let student_data = await resultModel.aggregate([
//     //   { $match: match },
//     //   {
//     //     $lookup: {
//     //       from: "course_subjects",
//     //       let: { subjectId: "$subjectId" },
//     //       pipeline: [
//     //         {
//     //           $match: {
//     //             $expr: {
//     //               $and: [
//     //                 { $eq: ["$_id", "$$subjectId"] },
//     //                 { $eq: ["$isActive", true] },
//     //               ],
//     //             },
//     //           },
//     //         },
//     //         // { $project: { name: 1 } },
//     //       ],
//     //       as: "subject",
//     //     },
//     //   },
//     //   {
//     //     $lookup: {
//     //       from: "forms",
//     //       let: { subjectId: "$subjectId" },
//     //       pipeline: [
//     //         {
//     //           $match: {
//     //             $expr: {
//     //               $and: [
//     //                 { $eq: ["$subjectId", "$$subjectId"] },
//     //                 { $eq: ["$isActive", true] },
//     //               ],
//     //             },
//     //           },
//     //         },
//     //       ],
//     //       as: "documents",
//     //     },
//     //   },
//     //   {
//     //     $lookup: {
//     //       from: "users",
//     //       let: { createdBy: "$createdBy" },
//     //       pipeline: [
//     //         {
//     //           $match: {
//     //             $expr: {
//     //               $and: [
//     //                 { $eq: ["$_id", "$$createdBy"] },
//     //                 { $eq: ["$isActive", true] },
//     //               ],
//     //             },
//     //           },
//     //         },
//     //       ],
//     //       as: "user",
//     //     },
//     //   },
//     //   // { $unwind: { path: "$result" } },
//     //   {
//     //     $facet: {
//     //       student: [
//     //         { $sort: sort },
//     //         { $skip: skip },
//     //         { $limit: limit },
//     //         {
//     //           $project: {
//     //             _id: 1,
//     //             score: 1,
//     //             isApprove: 1,
//     //             "subject.title": 1,
//     //             "documents.document_image": 1,
//     //             "user.name": 1,
//     //             "user.email": 1,
//     //             //score: { $first: "$result.score" },
//     //             isExamGiven: {
//     //               $cond: [
//     //                 {
//     //                   $eq: ["$result", []],
//     //                 },
//     //                 { $const: false },
//     //                 true,
//     //               ],
//     //             },
//     //             // isExam: {
//     //             //   $cond: [
//     //             //     {
//     //             //       $eq: ["$documents", []],
//     //             //     },
//     //             //     { $const: false },
//     //             //     true,
//     //             //   ],
//     //             // },
//     //             // isPass: {
//     //             //     $cond: [
//     //             //         {
//     //             //             $gte: ["$result.score", [40]]
//     //             //         },
//     //             //         { $const: true }, false
//     //             //     ]
//     //             // }
//     //           },
//     //         },
//     //       ],
//     //       student_count: [{ $count: "count" }],
//     //     },
//     //   },
//     // ]);

//     let student_data = await training_optionModel.aggregate([
//       {
//         $lookup: {
//           from: "course_subjects",
//           let: { subjectId: "$subjectId" },
//           pipeline: [
//             {
//               $match: {
//                 $expr: {
//                   $and: [
//                     { $eq: ["$_id", "$$subjectId"] },
//                     { $eq: ["$isActive", true] },
//                   ],
//                 },
//               },
//             },
//           ],
//           as: "subject",
//         },
//       },
//       {
//         $lookup: {
//           from: "results",
//           let: { subjectId: "$subjectId", createdBy: "$createdBy" },
//           pipeline: [
//             {
//               $match: {
//                 $expr: {
//                   $and: [
//                     { $eq: ["$subjectId", "$$subjectId"] },
//                     { $eq: ["$createdBy", "$$createdBy"] },
//                     { $eq: ["$isActive", true] },
//                   ],
//                 },
//               },
//             },
//           ],
//           as: "result",
//         },
//       },
//       {
//         $lookup: {
//           from: "forms",
//           let: { subjectId: "$subjectId", createdBy: "$createdBy" },
//           pipeline: [
//             {
//               $match: {
//                 $expr: {
//                   $and: [
//                     { $eq: ["$subjectId", "$$subjectId"] },
//                     { $eq: ["$createdBy", "$$createdBy"] },
//                     { $eq: ["$isActive", true] },
//                   ],
//                 },
//               },
//             },
//           ],
//           as: "documents",
//         },
//       },
//       {
//         $lookup: {
//           from: "users",
//           let: { createdBy: "$createdBy" },
//           pipeline: [
//             {
//               $match: {
//                 $expr: {
//                   $and: [
//                     { $eq: ["$_id", "$$createdBy"] },
//                     { $eq: ["$isActive", true] },
//                   ],
//                 },
//               },
//             },
//           ],
//           as: "user",
//         },
//       },
//       { $match: match },
//       {
//         $facet: {
//           student: [
//             { $sort: sort },
//             { $skip: skip },
//             { $limit: limit },
//             {
//               $project: {
//                 _id: 1,
//                 optionType: 1,
//                 // subjectId: 1,
//                 // "subject.title": 1,
//                 "result.isApprove": 1,
//                 "result._id": 1,
//                 "documents.document_image": 1,
//                 "user.name": 1,
//                 "user.email": 1,
//                 subjectName: { $first: "$subject.title" },
//                 //score: { $first: "$result.score" },
//                 isExamGiven: {
//                   $cond: [
//                     {
//                       $eq: ["$result", []],
//                     },
//                     { $const: false },
//                     true,
//                   ],
//                 },
//                 isDocument: {
//                   $cond: [
//                     {
//                       $eq: ["$documents", []],
//                     },
//                     { $const: false },
//                     true,
//                   ],
//                 },
//                 isCourse: {
//                   $cond: [
//                     {
//                       $eq: ["$subject", []],
//                     },
//                     { $const: false },
//                     true,
//                   ],
//                 },
//                 // isPass: {
//                 //     $cond: [
//                 //         {
//                 //             $gte: ["$result.score", [40]]
//                 //         },
//                 //         { $const: true }, false
//                 //     ]
//                 // }
//               },
//             },
//           ],
//           student_count: [{ $count: "count" }],
//           recorded_count: [{ $match: { optionType: 0 } }, { $count: "recorded_count" }],
//           live_count: [{ $match: { optionType: 1 } }, { $count: "live_count" }],
//           physical_count: [{ $match: { optionType: 2 } }, { $count: "physical_count" }]
//         },
//       },
//     ]);
//     response.recorded_count = student_data[0]?.recorded_count[0]?.recorded_count;
//     response.live_count = student_data[0]?.live_count[0]?.live_count;
//     response.physical_count = student_data[0]?.physical_count[0]?.physical_count;
//     response.student_data = student_data[0].student || [];
//     response.state = {
//       page,
//       limit,
//       page_limit: Math.ceil(student_data[0]?.student_count[0]?.count / limit),
//     };
//     if (response)
//       return res
//         .status(200)
//         .json(new apiResponse(200, "Get student successfully", response, {}));
//     else
//       return res
//         .status(400)
//         .json(new apiResponse(400, "Database error ", {}, {}));
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .json(new apiResponse(500, "Internal server error", {}, error));
//   }
// };

export const delete_student = async (req: Request, res: Response) => {
  reqInfo(req);
  let id = req.params.id;
  let body: any = req.body;
  body.updatedBy = (req.header("user") as any)?._id;

  try {
    let response = await userModel.findByIdAndDelete({ _id: ObjectId(id) });
    if (response) {
      let training_option = await training_optionModel.deleteMany({
        createdBy: ObjectId(id),
      });
      await video_training_logModel.deleteMany({ logUserId: ObjectId(id) });
      return res
        .status(200)
        .json(new apiResponse(200, "Student successfully deleted", {}, {}));
    } else
      return res
        .status(400)
        .json(
          new apiResponse(400, "Database error while deleting user", {}, {})
        );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new apiResponse(500, "Internal server error", {}, {}));
  }
};
