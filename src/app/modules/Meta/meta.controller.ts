import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import TAuthUser from "../../interfaces/common";
import { MetaService } from "./meta.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const fetchDashboardMetaData = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user as TAuthUser;

    const result = await MetaService.fetchDashboardMetaData(user);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Dashboard meta data fetched successfully",
      data: result,
    });
  }
);

export const MetaController = {
  fetchDashboardMetaData,
};
