import { Request } from "express";
import { TFile } from "../../interfaces/file";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";
import { TPagination } from "../../interfaces/pagination";
import { Specialties } from "@prisma/client";

const getAllSpecialties = async (): Promise<Specialties[]> => {
  const result = await prisma.specialties.findMany();
  return result;
};

const getSpecialtyFormDb = async (id: string): Promise<Specialties | null> => {
  const result = await prisma.specialties.findUniqueOrThrow({
    where: {
      id,
    },
  });
  return result;
};

const insertSpecialtiesIntoDB = async (req: Request) => {
  const file = req.file as TFile;

  if (file) {
    const uploadImage = await fileUploader.uploadToCloudinary(file);
    req.body.icon = uploadImage?.secure_url;
  }

  const result = await prisma.specialties.create({
    data: req.body,
  });
  return result;
};

export const SpecialtiesService = {
  insertSpecialtiesIntoDB,
  getSpecialtyFormDb,
  getAllSpecialties,
};
