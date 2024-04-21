import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let success: boolean = false;
  let message: string = err.message || "Something went wrong!";
  let error: any = err;

  if (err instanceof Prisma.PrismaClientValidationError) {
    (statusCode = 403), (message = "Validation Error"), (error = err.message);
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      (statusCode = 403), (message = "Duplicate Error"), (error = err.meta);
    }
  }

  res.status(statusCode).json({
    success,
    message,
    error,
  });
};

export default globalErrorHandler;
