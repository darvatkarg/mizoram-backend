"use strict";
import { reqInfo } from "../../helpers/winston_logger";
import { user_batchModel, training_optionModel } from "../../database";
import { apiResponse, URL_decode, userStatus } from "../../common";
import { Request, response, Response } from "express";

const ObjectId = require("mongoose").Types.ObjectId;

export const add_user_batch = async (req: Request, res: Response) => {
  reqInfo(req);
  let body = req.body;
  let user: any = (req.header("user") as any)?._id;
  body.createdBy = user;
  try {
    let response = await new user_batchModel(body).save();

    let updateTrainingOption = await training_optionModel.updateMany(
      {
        createdBy: { $in: response.selectedUser },
        subjectId: ObjectId(body.subjectId),
      },
      { $set: { isUserBatch: true } }
    );
    if (response)
      res.status(200).json(new apiResponse(200, "Student added", response, {}));
    else res.status(400).json(new apiResponse(400, "Database error", {}, {}));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new apiResponse(500, "Internal Server error", {}, {}));
  }
};

export const delete_user_batch = async (req: Request, res: Response) => {
  reqInfo(req);
  let body = req.body;
  req.body.updatedBy = (req.header("user") as any)?._id;

  try {
    let response = await user_batchModel.findOneAndUpdate(
      { _id: ObjectId(req.params.id), isActive: true },
      { isActive: false }
    );
    // let response = await user_batchModel.findByIdAndDelete({ _id: ObjectId(req.params.id) })

    if (response) {
      let updateTrainingOption = await training_optionModel.updateMany(
        {
          createdBy: { $in: response.selectedUser },
          subjectId: ObjectId(response.subjectId),
        },
        { $set: { isUserBatch: false } }
      );
      return res
        .status(200)
        .json(
          new apiResponse(200, "User batch successfully deleted", response, {})
        );
    } else {
      return res
        .status(400)
        .json(
          new apiResponse(
            400,
            "Database error while deleting User batch",
            {},
            {}
          )
        );
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new apiResponse(500, "Internal server error", {}, {}));
  }
};

// export const get_date_time_slot = async (req: Request, res: Response) => {
//   reqInfo(req);
//   let body = req.body;
//   let user: any = (req.header("user") as any)?._id;
//   body.createdBy = user;
//   try {
//     let response = await user_batchModel.findOne(
//       { createdBy: ObjectId(user), isActive: true },
//       { date: 1, time_slotId: 1, subjectId: 1 }
//     );
//     if (response)
//       return res
//         .status(200)
//         .json(new apiResponse(200, "Your schedule time slot", response, {}));
//     else
//       return res
//         .status(400)
//         .json(new apiResponse(400, "Database Error", {}, {}));
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .json(new apiResponse(500, "Internal Server error", {}, {}));
//   }
// };

// export const get__date_time_slot = async (req: Request, res: Response) => {
//   reqInfo(req);
//   let body = req.body;
//   let user: any = (req.header("user") as any)?._id;
//   body.createdBy = user;
//   try {
//     // let response = await user_batchModel.findOne({ createdBy: ObjectId(user), isActive: true }, { date: 1, time_slotId: 1 })
//     let response = await user_batchModel.aggregate([
//       { $match: { createdBy: ObjectId(user), isActive: true } },
//       {
//         $lookup: {
//           from: "time_slots",
//           let: { time_slotId: "$time_slotId" },
//           pipeline: [
//             {
//               $match: {
//                 $expr: {
//                   $and: [
//                     { $eq: ["$_id", "$$time_slotId"] },
//                     { $eq: ["$isActive", true] },
//                   ],
//                 },
//               },
//             },
//           ],
//           as: "time_slot",
//         },
//       },
//       {
//         $project: {
//           date: 1,
//           time_slotId: 1,
//           subjectId: 1,
//           "time_slot.start_time": 1,
//           "time_slot.end_time": 1,
//         },
//       },
//     ]);
//     if (response)
//       return res
//         .status(200)
//         .json(new apiResponse(200, "Your schedule time slot", response, {}));
//     else
//       return res
//         .status(400)
//         .json(new apiResponse(400, "Database error", {}, {}));
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .json(new apiResponse(500, "Internal Server error", {}, {}));
//   }
// };

// export const get_date_time_subjectId = async (req: Request, res: Response) => {
//   reqInfo(req);
//   let user: any = (req.header("user") as any)?._id;
//   try {
//     // let response = await user_batchModel.findOne({ createdBy: ObjectId(user), isActive: true, subjectId: ObjectId(req.params.id) }, { date: 1, time_slotId: 1,subjectId:1 })
//     let response = await user_batchModel.aggregate([
//       {
//         $match: {
//           createdBy: ObjectId(user),
//           isActive: true,
//           subjectId: ObjectId(req.params.id),
//         },
//       },
//       {
//         $lookup: {
//           from: "time_slots",
//           let: { time_slotId: "$time_slotId" },
//           pipeline: [
//             {
//               $match: {
//                 $expr: {
//                   $and: [
//                     { $eq: ["$_id", "$$time_slotId"] },
//                     { $eq: ["$isActive", true] },
//                   ],
//                 },
//               },
//             },
//           ],
//           as: "time_slot",
//         },
//       },
//       {
//         $project: {
//           date: 1,
//           time_slotId: 1,
//           subjectId: 1,
//           "time_slot.start_time": 1,
//           "time_slot.end_time": 1,
//         },
//       },
//     ]);
//     console.log(response);

//     if (response)
//       return res
//         .status(200)
//         .json(new apiResponse(200, "Your schedule time slot", response, {}));
//     else
//       return res
//         .status(400)
//         .json(new apiResponse(400, "Database error", {}, {}));
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .json(new apiResponse(500, "Internal Server error", {}, {}));
//   }
// };
