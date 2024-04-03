import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { UserService } from "./user.service";
import pick from "../../../shared/pick";
import { userFilterAbleFields } from "./user.constant";
import { filterOptions } from "../Admin/admin.constant";
import httpStatus from "http-status";
import TAuthUser from "../../interfaces/common";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createAdmin(req);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Admin created successfully",
    data: result,
  });
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createDoctor(req);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Doctor created successfully",
    data: result,
  });
});

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createPatient(req);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Patient created successfully",
    data: result,
  });
});

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req?.query, userFilterAbleFields);
  const options = pick(req?.query, filterOptions);

  const result = await UserService.getAllUser(filters, options);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const changeUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.changeUserStatus(id, req.body?.status);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User status changed successfully",
    data: result,
  });
});

const getMyProfile = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user as TAuthUser;

    const result = await UserService.getMyProfile(user);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Profile Retrieved successfully",
      data: result,
    });
  }
);

const updateMyProfile = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user as TAuthUser;

    const result = await UserService.updateMyProfile(user, req);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Profile Updated successfully",
      data: result,
    });
  }
);

export const UserController = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUser,
  changeUserStatus,
  getMyProfile,
  updateMyProfile,
};
