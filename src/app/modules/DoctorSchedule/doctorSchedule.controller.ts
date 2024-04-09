import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import TAuthUser from "../../interfaces/common";
import { DoctorScheduleService } from "./doctorSchedule.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const insertDoctorSchedule = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user as TAuthUser;

    const result = await DoctorScheduleService.insertDoctorScheduleIntoDB(
      user,
      req.body
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Doctor Schedule created successfully",
      data: result,
    });
  }
);

export const DoctorScheduleController = {
  insertDoctorSchedule,
};
