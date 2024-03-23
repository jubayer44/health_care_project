import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { UserController } from "./user.controller";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  UserController.createAdmin
);

export const UserRoutes = router;
