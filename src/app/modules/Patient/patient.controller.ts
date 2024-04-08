import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { filterOptions } from "../Admin/admin.constant";
import { patientFilterAbleFields } from "./patient.constant";
import { PatientService } from "./patient.service";

const getAllPatients = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req?.query, patientFilterAbleFields);
  const options = pick(req?.query, filterOptions);

  const result = await PatientService.getAllPatients(filters, options);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Patient fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getPatient = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PatientService.getPatientFormDb(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Patient fetched successfully",
    data: result,
  });
});

const updatePatient = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await PatientService.updateDPatientIntoDB(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Patient updated successfully",
    data: result,
  });
});

const deletePatient = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PatientService.deletePatientFromDb(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Patient deleted successfully",
    data: result,
  });
});

const softDeletePatient = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PatientService.softDeletePatientIntoDb(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Patient deleted successfully",
    data: result,
  });
});

export const PatientController = {
  getAllPatients,
  getPatient,
  deletePatient,
  softDeletePatient,
  updatePatient,
};
