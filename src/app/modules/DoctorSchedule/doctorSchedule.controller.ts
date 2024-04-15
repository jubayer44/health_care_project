import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import TAuthUser from "../../interfaces/common";
import { DoctorScheduleService } from "./doctorSchedule.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import { filterOptions } from "../Admin/admin.constant";

const getMySchedule = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const filters = pick(req?.query, ["startDate", "endDate", "isBooked"]);
    const options = pick(req?.query, filterOptions);
    const user = req?.user as TAuthUser;
    const result = await DoctorScheduleService.getMyScheduleFromDB(
      filters,
      options,
      user
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "My Schedule fetched successfully",
      data: result,
    });
  }
);

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

const deleteDoctorSchedule = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user as TAuthUser;
    const { id } = req.params;

    const result = await DoctorScheduleService.deleteDoctorScheduleFromDB(
      user,
      id
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Doctor Schedule deleted successfully",
      data: result,
    });
  }
);

export const DoctorScheduleController = {
  insertDoctorSchedule,
  getMySchedule,
  deleteDoctorSchedule,
};
