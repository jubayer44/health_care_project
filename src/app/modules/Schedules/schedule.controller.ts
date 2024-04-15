import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { ScheduleService } from "./schedule.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import { filterOptions } from "../Admin/admin.constant";
import TAuthUser from "../../interfaces/common";

const getSchedule = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const filters = pick(req?.query, ["startDate", "endDate"]);
    const options = pick(req?.query, filterOptions);
    const user = req?.user as TAuthUser;
    const result = await ScheduleService.getScheduleFromDB(
      filters,
      options,
      user
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Schedule fetched successfully",
      data: result,
    });
  }
);

const insertSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.insertScheduleIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Schedule created successfully",
    data: result,
  });
});

export const ScheduleController = {
  insertSchedule,
  getSchedule,
};
