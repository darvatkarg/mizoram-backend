"use strict";
import { reqInfo } from "../../helpers/winston_logger";
import { bookModel, feedbackModel } from "../../database";
import { apiResponse, bookType, URL_decode } from "../../common";
import { Request, Response } from "express";
import { deleteImage, delete_file } from "../../helpers/S3";
import { downloadModel } from "../../database/models/downloads";

const ObjectId = require("mongoose").Types.ObjectId;

export const add_book = async (req: Request, res: Response) => {
  reqInfo(req);
  let body = req.body,
    search = new RegExp(`^${body.title}$`, "ig");
  let user: any = req.header("user");
  body.createdBy = user.createdBy;
  body.auditorId = user._id;
  try {
    let isExist = await bookModel.findOne({
      title: { $regex: search },
      isActive: true,
    });
    if (isExist)
      return res
        .status(409)
        .json(new apiResponse(409, "Book already register", {}, {}));
    let response = await new bookModel(body).save();
    if (response)
      return res
        .status(200)
        .json(new apiResponse(200, "Book successfully added", {}, {}));
    else
      return res
        .status(400)
        .json(
          new apiResponse(
            409,
            "Database error while adding book",
            {},
            `${response}`
          )
        );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new apiResponse(500, "Internal server error", {}, error));
  }
};

export const get_filter_book_admin = async (req: Request, res: Response) => {
  reqInfo(req);
  let user: any = req.header("user"),
    { search, limit, page } = req.body,
    skip = 0,
    response: any = {},
    match: any = { auditorId: ObjectId(user?._id) },
    sort: any = {};
  limit = parseInt(limit);
  skip = (parseInt(page) - 1) * parseInt(limit);
  try {
    // Database Filtering
    if (search) {
      var titleArray: Array<any> = [];
      var authorArray: Array<any> = [];
      var descriptionArray: Array<any> = [];
      var publisherArray: Array<any> = [];
      search = search.split(" ");
      search.forEach((data) => {
        titleArray.push({ title: { $regex: data, $options: "si" } });
        authorArray.push({ author: { $regex: data, $options: "si" } });
        descriptionArray.push({
          description: { $regex: data, $options: "si" },
        });
        publisherArray.push({ publisher: { $regex: data, $options: "si" } });
      });
      match.$or = [
        { $and: titleArray },
        { $and: authorArray },
        { $and: descriptionArray },
        { $and: publisherArray },
      ];
    }
    // match['phoneNumber'] = { $regex: search, $options: 'si' }
    match.isActive = true;
    // Sorting Database
    sort.createdAt = -1;

    let book_data = await bookModel.aggregate([
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
                title: 1,
                author: 1,
                image: 1,
                feedback_rating: 1,
                isFree: 1,
                cost: 1,
                isEnable: 1,
              },
            },
          ],
          book_count: [{ $count: "count" }],
        },
      },
    ]);
    response.book_data = book_data[0].user || [];
    response.state = {
      page,
      limit,
      page_limit: Math.ceil(book_data[0]?.book_count[0]?.count / limit),
    };
    res
      .status(200)
      .json(new apiResponse(200, `Get books successfully`, response, {}));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new apiResponse(500, "Internal server error", {}, {}));
  }
};
