import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import TAuthUser from "../../interfaces/common";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { UserService } from "../User/user.service";
import { PrescriptionService } from "./prescription.service";
import pick from "../../../shared/pick";

const createPrescription = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req?.user as TAuthUser;

    const result = await PrescriptionService.createPrescriptionIntoDB(
      user,
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Prescription created successfully",
      data: result,
    });
  }
);

const getMyPrescriptions = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req?.user as TAuthUser;
    const filter = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = await PrescriptionService.getMyPrescriptions(user, filter);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "My Prescriptions fetched successfully",
      data: result,
    });
  }
);

export const PrescriptionController = {
  createPrescription,
  getMyPrescriptions,
};
