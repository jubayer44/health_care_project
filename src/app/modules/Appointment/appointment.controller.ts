import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import TAuthUser from "../../interfaces/common";
import { AppointmentService } from "./appointment.service";
import sendResponse from "../../../shared/sendResponse";
import pick from "../../../shared/pick";
import { filterOptions } from "../Admin/admin.constant";
import httpStatus from "http-status";
import { appointmentFilterAbleFields } from "./appointment.constant";

const createAppointment = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req?.user as TAuthUser;

    const result = await AppointmentService.createAppointmentIntoDB(
      user,
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Appointment created successfully",
      data: result,
    });
  }
);
const getMyAppointment = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req?.user as TAuthUser;

    const filters = pick(req?.query, appointmentFilterAbleFields);
    const options = pick(req?.query, filterOptions);

    const result = await AppointmentService.getMyAppointmentFromDB(
      user,
      filters,
      options
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Appointment retrieved successfully",
      data: result,
    });
  }
);

const changeAppointmentStatus = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const { id } = req.params;
    const user = req.user as TAuthUser;

    const result = await AppointmentService.changeAppointmentStatus(
      id,
      req.body,
      user
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Appointment status changed successfully",
      data: result,
    });
  }
);

export const AppointmentController = {
  createAppointment,
  getMyAppointment,
  changeAppointmentStatus,
};
