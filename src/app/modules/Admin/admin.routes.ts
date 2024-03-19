import express from "express";
import { AdminController } from "./admin.controller";

const router = express.Router();

router.get("/", AdminController.getAllAdmins);

router.get("/:id", AdminController.getAdmin);

router.patch("/:id", AdminController.updateAdmin);

router.delete("/:id", AdminController.deleteAdmin);

router.delete("/soft/:id", AdminController.softDeleteAdmin);

export const AdminRoutes = router;
