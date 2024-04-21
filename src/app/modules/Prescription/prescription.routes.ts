import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { PrescriptionController } from "./prescription.controller";

const router = express.Router();

router.get(
  "/my-prescriptions",
  auth(UserRole.PATIENT),
  PrescriptionController.getMyPrescriptions
);

router.post(
  "/",
  auth(UserRole.DOCTOR),
  PrescriptionController.createPrescription
);

export const PrescriptionRoutes = router;
