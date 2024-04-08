import { Patient, Prisma, UserStatus } from "@prisma/client";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import prisma from "../../../shared/prisma";
import { TParams } from "../../interfaces/common";
import { TPagination } from "../../interfaces/pagination";
import { patientSearchAbleFields } from "./patient.constant";
import { TPatientUpdate } from "./patient.interface";

const getAllPatients = async (params: TParams, options: TPagination) => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...restData } = params;

  const andConditions: Prisma.PatientWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: patientSearchAbleFields?.map((field) => ({
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

  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.PatientWhereInput = { AND: andConditions };

  const result = await prisma.patient.findMany({
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
    include: {
      patientHealthData: true,
      medicalReport: true,
    },
  });

  const total = await prisma.patient.count({
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

const getPatientFormDb = async (id: string): Promise<Patient | null> => {
  const result = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  return result;
};

const updateDPatientIntoDB = async (
  id: string,
  payload: Partial<TPatientUpdate>
): Promise<Patient> => {
  const { patientHealthData, medicalReport, ...patientData } = payload;

  const patientInfo = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  await prisma.$transaction(async (tClient) => {
    const updatePatient = await tClient.patient.update({
      where: {
        id,
      },
      data: patientData,
    });

    if (patientHealthData) {
      await tClient.patientHealthData.upsert({
        where: {
          patientId: patientInfo.id,
        },
        update: patientHealthData,
        create: {
          ...patientHealthData,
          patientId: patientInfo.id,
        },
      });
    }

    if (medicalReport) {
      await tClient.medicalReport.create({
        data: {
          ...medicalReport,
          patientId: patientInfo.id,
        },
      });
    }

    return updatePatient;
  });

  const result = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      patientHealthData: true,
      medicalReport: true,
    },
  });

  return result;
};

const deletePatientFromDb = async (id: string): Promise<Patient | null> => {
  const patientInfo = await prisma.patient.findUniqueOrThrow({
    where: { id },
  });
  const result = await prisma.$transaction(async (tClient) => {
    await tClient.medicalReport.deleteMany({
      where: {
        patientId: id,
      },
    });

    await tClient.patientHealthData.delete({
      where: {
        patientId: id,
      },
    });

    const deletedPatient = await tClient.patient.delete({
      where: {
        id,
      },
    });

    await tClient.user.delete({
      where: {
        email: patientInfo.email,
      },
    });

    return deletedPatient;
  });

  return result;
};

const softDeletePatientIntoDb = async (id: string) => {
  const patientInfo = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.$transaction(async (tClient) => {
    const patientDeletedData = await tClient.patient.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    await tClient.user.update({
      where: {
        email: patientInfo.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return patientDeletedData;
  });

  return result;
};

export const PatientService = {
  getAllPatients,
  getPatientFormDb,
  deletePatientFromDb,
  softDeletePatientIntoDb,
  updateDPatientIntoDB,
};
