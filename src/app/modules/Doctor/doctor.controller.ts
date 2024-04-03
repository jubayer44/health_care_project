import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { DoctorService } from "./doctor.service";
import sendResponse from "../../../shared/sendResponse";

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

export const DoctorController = {
  updateDoctor,
};
