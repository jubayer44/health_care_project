import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { DoctorService } from "./doctor.service";
import sendResponse from "../../../shared/sendResponse";
import { doctorFilterAbleFields } from "./doctor.constant";
import pick from "../../../shared/pick";
import { filterOptions } from "../Admin/admin.constant";
import httpStatus from "http-status";

const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req?.query, doctorFilterAbleFields);
  const options = pick(req?.query, filterOptions);

  const result = await DoctorService.getAllDoctors(filters, options);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Doctors fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorService.getDoctorFormDb(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Doctor fetched successfully",
    data: result,
  });
});

const updateDoctor = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await DoctorService.updateDoctorIntoDB(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Doctor updated successfully",
    data: result,
  });
});

const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorService.deleteDoctorFromDb(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Doctor deleted successfully",
    data: result,
  });
});

const softDeleteDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorService.softDeleteDoctorIntoDb(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Doctor deleted successfully",
    data: result,
  });
});

export const DoctorController = {
  updateDoctor,
  getAllDoctors,
  getDoctor,
  deleteDoctor,
  softDeleteDoctor,
};
