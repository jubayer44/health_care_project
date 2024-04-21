import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import TAuthUser from "../../interfaces/common";
import { ReviewService } from "./review.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const createReview = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req?.user as TAuthUser;

    const result = await ReviewService.createReviewIntoDB(user, req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Review created successfully",
      data: result,
    });
  }
);

export const ReviewController = {
  createReview,
};
