import { Request, Response } from "express";
import sendResponse from "../../../shared/sendResponse";
import { UserService } from "./user.service";

const createAdmin = async (req: Request, res: Response) => {
  try {
    const result = await UserService.createAdmin(req.body);
    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Admin created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.name || "Something went wrong",
      data: error,
    });
  }
};

export const UserController = {
  createAdmin,
};
