import { NextFunction, Request, Response } from "express";

const globalErrorHandler = async (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500).json({
    success: false,
    message: error?.name || "Something went wrong",
    data: error,
  });
};

export default globalErrorHandler;
