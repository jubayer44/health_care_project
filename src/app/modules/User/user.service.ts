import {
  Admin,
  Doctor,
  Patient,
  Prisma,
  UserRole,
  UserStatus,
} from "@prisma/client";
import * as bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { Request } from "express";
import { fileUploader } from "../../../helpers/fileUploader";
import { TFile } from "../../interfaces/file";
import { TPagination } from "../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import { userSearchAbleFields } from "./user.constant";

const createAdmin = async (req: Request): Promise<Admin> => {
  const file = req?.file as TFile;
  if (file) {
    const uploadPhoto = await fileUploader.uploadToCloudinary(file);
    req.body.admin.profilePhoto = uploadPhoto?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  const userData = {
    email: req.body.admin?.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };
  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });
    const createdAdminData = await transactionClient.admin.create({
      data: req.body.admin,
    });
    return createdAdminData;
  });
  return result;
};

const createDoctor = async (req: Request): Promise<Doctor> => {
  const file = req?.file as TFile;
  if (file) {
    const uploadPhoto = await fileUploader.uploadToCloudinary(file);
    req.body.doctor.profilePhoto = uploadPhoto?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  const userData = {
    email: req.body.doctor?.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });
    const createdDoctorData = await transactionClient.doctor.create({
      data: req.body.doctor,
    });
    return createdDoctorData;
  });
  return result;
};

const createPatient = async (req: Request): Promise<Patient> => {
  const file = req?.file as TFile;
  if (file) {
    const uploadPhoto = await fileUploader.uploadToCloudinary(file);
    req.body.patient.profilePhoto = uploadPhoto?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  const userData = {
    email: req.body.patient?.email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });
    const createdPatientData = await transactionClient.patient.create({
      data: req.body.patient,
    });
    return createdPatientData;
  });
  return result;
};

const getAllUser = async (params: any, options: TPagination) => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...restData } = params;

  const andConditions: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchAbleFields?.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(restData)?.length > 0) {
    andConditions.push({
      AND: Object.keys(restData).map((key) => ({
        [key]: (restData as any)[key],
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput = { AND: andConditions };

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options?.sortBy && options?.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      needPasswordChange: true,
      createdAt: true,
      updatedAt: true,
      admin: true,
      doctor: true,
      patient: true,
    },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total: total,
    },
    data: result,
  };
};

const changeUserStatus = async (id: string, status: UserStatus) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.user.update({
    where: {
      id,
    },
    data: {
      status: status,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      needPasswordChange: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
};

export const UserService = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUser,
  changeUserStatus,
};
