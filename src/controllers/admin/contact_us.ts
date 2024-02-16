"use strict";
import { reqInfo } from "../../helpers/winston_logger";
import { contactUsModel } from "../../database";
import { apiResponse } from "../../common";
import { Request, Response } from "express";

//Get All ContactUs Lists
export const get_contactUs = async (req: Request, res: Response) => {
  // reqInfo(req);
  try {
    let response = await contactUsModel.find(
      { isActive: true },
      { isActive: 0, __v: 0 }
    );
    if (response) {
      return res
        .status(200)
        .json(
          new apiResponse(200, "Get Contactus List successfully", response, {})
        );
    } else
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

//Delete ContactUs

export const delete_contactUs = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response = await contactUsModel.deleteOne({ _id: id });
    if (response.deletedCount > 0) {
      return res
        .status(200)
        .json(
          new apiResponse(200, "Deleted Contactus successfully", response, {})
        );
    } else
      return res
        .status(400)
        .json(
          new apiResponse(
            400,
            "Database error while deleting contactus",
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
