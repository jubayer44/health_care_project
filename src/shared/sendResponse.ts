import { Response } from "express";

const sendResponse = <T>(
  res: Response,
  responseData: {
    success: boolean;
    statusCode: number;
    message: string;
    meta?: {
      page: number;
      limit: number;
      total: number;
    };
    data: T | null | undefined;
  }
) => {
  res.status(responseData.statusCode).json({
    success: responseData.success,
    message: responseData.message,
    meta: responseData.meta || null || undefined,
    data: responseData.data || null || undefined,
  });
};

export default sendResponse;
