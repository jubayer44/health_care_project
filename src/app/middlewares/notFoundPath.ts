import { Request, Response } from "express";
import httpStatus from "http-status";

const notFoundPath = async (req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your request path is not found",
    },
  });
};

export default notFoundPath;
