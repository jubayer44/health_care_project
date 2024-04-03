import express, { NextFunction, Request, Response } from "express";
import { SpecialtiesController } from "./specialties.controller";
import { fileUploader } from "../../../helpers/fileUploader";
import { SpecialtiesValidationSchemas } from "./specialties.validation";

const router = express.Router();

router.post(
  "/",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = SpecialtiesValidationSchemas.create.parse(
      JSON.parse(req.body.data)
    );
    return SpecialtiesController.insertSpecialties(req, res, next);
  }
);

export const SpecialtiesRoutes = router;
