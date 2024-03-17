import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import pick from "../../../shared/pick";
import { filterOptions, filterableFields } from "./admin.constant";

const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const filters = pick(req?.query, filterableFields);
    const options = pick(req?.query, filterOptions);

    const result = await AdminService.getAllAdmins(filters, options);
    res.status(200).json({
      success: true,
      message: "Admins fetched successfully",
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

export const AdminController = {
  getAllAdmins,
};
