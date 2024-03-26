import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { filterOptions, adminFilterAbleFields } from "./admin.constant";
import { AdminService } from "./admin.service";

const getAllAdmins = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req?.query, adminFilterAbleFields);
  const options = pick(req?.query, filterOptions);

  const result = await AdminService.getAllAdmins(filters, options);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admins fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AdminService.getAdminFormDb(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin fetched successfully",
    data: result,
  });
});

const updateAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AdminService.updateAdminIntoDb(id, req?.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin updated successfully",
    data: result,
  });
});

const deleteAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AdminService.deleteAdminFromDb(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin deleted successfully",
    data: result,
  });
});

const softDeleteAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AdminService.softDeleteAdminIntoDb(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin deleted successfully",
    data: result,
  });
});

export const AdminController = {
  getAllAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
};
