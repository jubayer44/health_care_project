import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { filterOptions, filterableFields } from "./admin.constant";
import { AdminService } from "./admin.service";

const getAllAdmins = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filters = pick(req?.query, filterableFields);
    const options = pick(req?.query, filterOptions);

    const result = await AdminService.getAllAdmins(filters, options);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Admins fetched successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (error: any) {
    next(error);
  }
};

const getAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await AdminService.getAdminFormDb(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Admin fetched successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const updateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await AdminService.updateAdminIntoDb(id, req?.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Admin updated successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const deleteAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await AdminService.deleteAdminFromDb(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Admin deleted successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const softDeleteAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await AdminService.softDeleteAdminIntoDb(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Admin deleted successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const AdminController = {
  getAllAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
};
