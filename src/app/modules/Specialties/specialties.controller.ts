import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { SpecialtiesService } from "./specialties.service";
import sendResponse from "../../../shared/sendResponse";

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
};
