"use strict";
import { reqInfo } from "../../helpers/winston_logger";
import { galleryModel } from "../../database";
import { apiResponse, URL_decode } from "../../common";
import { Request, Response } from "express";
import { deleteImage } from "../../helpers/S3";

const ObjectId = require("mongoose").Types.ObjectId;

export const add_gallery = async (req: Request, res: Response) => {
  reqInfo(req);
  let body = req.body;
  let user: any = req.header("user");
  body.createdBy = user._id;
  try {
    let response = await new galleryModel(body).save();
    if (response)
      return res
        .status(200)
        .json(new apiResponse(200, "Gallery successfully added", {}, {}));
    else
      return res
        .status(400)
        .json(
          new apiResponse(
            409,
            "Database error while adding gallery",
            {},
            `${response}`
          )
        );
  } catch (error) {
    return res
      .status(500)
      .json(new apiResponse(500, "Internal server error", {}, error));
  }
};

export const get_gallery = async (req: Request, res: Response) => {
  reqInfo(req);
  try {
    let response = await galleryModel
      .find(
        { isActive: true },
        { isActive: 0, createdBy: 0, createdAt: 0, updatedAt: 0, __v: 0 }
      )
      .sort({ image: 1 });
    if (response)
      return res
        .status(200)
        .json(new apiResponse(200, "Get gallery successfully", response, {}));
    else
      return res
        .status(400)
        .json(
          new apiResponse(
            400,
            "Database error while getting gallery",
            {},
            Error
          )
        );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new apiResponse(500, "Internal server error", {}, error));
  }
};

export const get_by_id_gallery = async (req: Request, res: Response) => {
  reqInfo(req);
  let body: any = req.body,
    id = req.params.id;
  try {
    let response = await galleryModel.findOne(
      { _id: ObjectId(id), isActive: true },
      { image: 1 }
    );
    if (response)
      return res
        .status(200)
        .json(new apiResponse(200, "Get gallery successfully", response, {}));
    else
      return res
        .status(400)
        .json(
          new apiResponse(400, "Database error while getting gallery", {}, {})
        );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new apiResponse(500, "Internal server error", {}, error));
  }
};

export const update_gallery = async (req: Request, res: Response) => {
  reqInfo(req);
  let body = req.body,
    id = body?.id,
    user: any = req.header("user");
  body.updatedBy = user._id;
  try {
    let response = await galleryModel.findOneAndUpdate(
      { _id: ObjectId(id), isActive: true },
      body
    );
    if (response) {
      if (response.image != body?.image) {
        let [folder_name, image_name] = await URL_decode(response?.image);
        await deleteImage(image_name, folder_name);
      }
      return res
        .status(200)
        .json(new apiResponse(200, `Gallery successfully updated`, {}, {}));
    } else
      return res
        .status(404)
        .json(
          new apiResponse(404, `Database error while updating gallery`, {}, {})
        );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new apiResponse(500, "Internal server error", {}, error));
  }
};

export const delete_gallery = async (req: Request, res: Response) => {
  reqInfo(req);
  try {
    let response = await galleryModel.findOneAndUpdate(
      { _id: ObjectId(req.params.id), isActive: true },
      { isActive: false, updatedBy: ObjectId((req.header("user") as any)?._id) }
    );
    if (response) {
      let [folder_name, image_name] = await URL_decode(response?.image);
      await deleteImage(image_name, folder_name);
      return res
        .status(200)
        .json(new apiResponse(200, `Gallery successfully deleted`, {}, {}));
    } else
      return res
        .status(404)
        .json(
          new apiResponse(404, `Database error while deleting gallery`, {}, {})
        );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new apiResponse(500, "Internal server error", {}, error));
  }
};

export const get_filter_gallery = async (req: Request, res: Response) => {
  reqInfo(req);
  let user: any = req.header("user"),
    { limit, page, ascending } = req.body,
    skip = 0,
    response: any = {},
    match: any = {},
    sort: any = {};
  limit = parseInt(limit);
  skip = (parseInt(page) - 1) * parseInt(limit);
  try {
    match.isActive = true;
    sort.createdAt = -1;

    let gallery_data = await galleryModel.aggregate([
      { $match: match },
      {
        $facet: {
          gallery: [
            { $sort: sort },
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                _id: 1,
                image: 1,
              },
            },
          ],
          gallery_count: [{ $count: "count" }],
        },
      },
    ]);
    response.gallery_data = gallery_data[0].gallery || [];
    response.state = {
      page,
      limit,
      page_limit: Math.ceil(gallery_data[0]?.gallery_count[0]?.count / limit),
    };
    res
      .status(200)
      .json(new apiResponse(200, `Get gallery successfully`, response, {}));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new apiResponse(500, "Internal server error", {}, {}));
  }
};
