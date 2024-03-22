import express from "express";
import validationRequest from "../../middlewares/validationRequiest";
import { AdminController } from "./admin.controller";
import { AdminValidationSchemas } from "./admin.validation";

const router = express.Router();

router.get("/", AdminController.getAllAdmins);

router.get("/:id", AdminController.getAdmin);

router.patch(
  "/:id",
  validationRequest(AdminValidationSchemas.adminUpdateValidationSchema),
  AdminController.updateAdmin
);

router.delete("/:id", AdminController.deleteAdmin);

router.delete("/soft/:id", AdminController.softDeleteAdmin);

export const AdminRoutes = router;
