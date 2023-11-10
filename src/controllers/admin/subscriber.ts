import { reqInfo } from "../../helpers/winston_logger";
import { sabpaisaModel, subscriptionModel } from "../../database";
import { apiResponse, userStatus } from "../../common";
import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import { email_login_mail } from "../../helpers/mail";
import { func } from "joi";

const ObjectId = require("mongoose").Types.ObjectId;

export const getSubscriber = async (req: Request, res: Response) => {
  let user: any = req.header("user"),
    { search, limit, page } = req.body,
    skip = 0,
    response: any = {},
    match: any = {},
    sort: any = {};
  limit = parseInt(limit);
  skip = (parseInt(page) - 1) * parseInt(limit);
  try {
    if (search) {
      var nameArray: Array<any> = [];
      var emailArray: Array<any> = [];
      var mobileArray: Array<any> = [];
      search = search.split(" ");
      search.forEach((data) => {
        nameArray.push({
          "userData.name": { $regex: `^${data}`, $options: "si" },
        });
        emailArray.push({
          "userData.email": { $regex: `^${data}`, $options: "si" },
        });
        mobileArray.push({
          "userData.mobile": { $regex: `^${data}`, $options: "si" },
        });
      });
      match.$or = [
        { $and: nameArray },
        { $and: emailArray },
        { $and: mobileArray },
      ];
    }
    match.isActive = true;
    sort.createdAt = -1;
    let sabpaisa_data = await sabpaisaModel.aggregate([
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
                phoneNumber: 1,
                email: 1,
                name: 1,
                subscriptionExpDate: 1,
              },
            },
          ],
          as: "userData",
        },
      },
      { $match: match },
      {
        $facet: {
          user: [{ $sort: sort }, { $skip: skip }, { $limit: limit }],
          sabpaisa_count: [{ $count: "count" }],
        },
      },
    ]);

    response.sabpaisa_data = sabpaisa_data[0].user || [];
    response.state = {
      page,
      limit,
      page_limit: Math.ceil(sabpaisa_data[0]?.sabpaisa_count[0]?.count / limit),
      data_count: sabpaisa_data[0]?.sabpaisa_count[0]?.count,
    };
    // console.log('response :>> ', response);
    if (response)
      return res
        .status(200)
        .json(
          new apiResponse(200, "Get Subscriber successfully", response, {})
        );
    else
      return res
        .status(400)
        .json(
          new apiResponse(
            400,
            "Database error while getting Subscriber",
            {},
            {}
          )
        );
  } catch (error) {
    console.log("error :>> ", error);
    return res
      .status(500)
      .json(new apiResponse(500, "Internal server error", {}, error));
  }
};

export const deleteSubscriber = async (req: Request, res: Response) => {
  reqInfo(req);
  let body = req.params,
    user: any = req.header("user");
  body.updatedBy = user._id;
  try {
    let response = await subscriptionModel.deleteOne(
      { _id: ObjectId(req.params.id), isActive: true },
      { isActive: false }
    );
    if (response)
      return res
        .status(200)
        .json(
          new apiResponse(200, `Subscriber detail successfully deleted`, {}, {})
        );
    else
      return res
        .status(404)
        .json(
          new apiResponse(404, `Database error while deleting subscriber`, {}, {})
        );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new apiResponse(500, "Internal server error", {}, error));
  }
};
