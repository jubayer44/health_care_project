import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { SpecialtiesService } from "./specialties.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const getAllSpecialties = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialtiesService.getAllSpecialties();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Specialties retrieved successfully",
    data: result,
  });
});

const getSpecialty = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialtiesService.getSpecialtyFormDb(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Specialty get successfully",
    data: result,
  });
});

const insertSpecialties = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialtiesService.insertSpecialtiesIntoDB(req);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Specialties created successfully",
    data: result,
  });
});

export const SpecialtiesController = {
  insertSpecialties,
  getAllSpecialties,
  getSpecialty,
};
