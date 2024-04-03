import express from "express";
import { DoctorController } from "./doctor.controller";

const router = express.Router();

router.patch("/:id", DoctorController.updateDoctor);

export const DoctorRoutes = router;
