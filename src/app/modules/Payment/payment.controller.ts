import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { PaymentService } from "./payment.service";
import sendResponse from "../../../shared/sendResponse";

const initPayment = catchAsync(async (req: Request, res: Response) => {
  const { appointmentId } = req.params;
  const result = await PaymentService.initPayment(appointmentId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Payment initiated successfully",
    data: result,
  });
});

const validationPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.validationPayment(req.query);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Payment validation successfully",
    data: result,
  });
});

export const PaymentController = {
  initPayment,
  validationPayment,
};
