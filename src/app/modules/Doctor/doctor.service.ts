import { Doctor, Prisma, UserStatus } from "@prisma/client";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import prisma from "../../../shared/prisma";
import { TPagination } from "../../interfaces/pagination";
import { doctorSearchAbleFields } from "./doctor.constant";
import { TParams } from "../../interfaces/common";

const getAllDoctors = async (params: TParams, options: TPagination) => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, specialties, ...restData } = params;

  const andConditions: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: doctorSearchAbleFields?.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (specialties && specialties.length > 0) {
    andConditions.push({
      doctorSpecialties: {
        some: {
          specialties: {
            title: {
              contains: specialties,
              mode: "insensitive",
            },
          },
        },
      },
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

  const whereConditions: Prisma.DoctorWhereInput = { AND: andConditions };

  const result = await prisma.doctor.findMany({
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
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  const total = await prisma.doctor.count({
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

const getDoctorFormDb = async (id: string): Promise<Doctor | null> => {
  const result = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  return result;
};

const updateDoctorIntoDB = async (id: string, payload: any) => {
  const { specialties, ...doctorData } = payload;

  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  await prisma.$transaction(async (tClient) => {
    const updateDoctor = await tClient.doctor.update({
      where: {
        id,
      },
      data: doctorData,
    });

    if (specialties && specialties.length > 0) {
      const deletedItem = specialties.filter((item: any) => item.isDeleted);

      if (deletedItem?.length > 0) {
        for (const specialty of deletedItem) {
          await tClient.doctorSpecialties.deleteMany({
            where: {
              doctorId: doctorInfo.id,
              specialtiesId: specialty.specialtiesId,
            },
          });
        }
      }

      const createdItem = specialties.filter((item: any) => !item.isDeleted);
      if (createdItem?.length > 0) {
        for (const specialty of createdItem) {
          await tClient.doctorSpecialties.create({
            data: {
              doctorId: doctorInfo.id,
              specialtiesId: specialty.specialtiesId,
            },
          });
        }
      }
    }

    return updateDoctor;
  });

  const result = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  return result;
};

const deleteDoctorFromDb = async (id: string): Promise<Doctor | null> => {
  await prisma.doctor.findUniqueOrThrow({
    where: { id },
  });
  const result = await prisma.$transaction(async (tClient) => {
    const doctorDeletedData = await tClient.doctor.delete({
      where: { id },
    });

    await tClient.user.delete({
      where: {
        email: doctorDeletedData?.email,
      },
    });
    return doctorDeletedData;
  });

  return result;
};

const softDeleteDoctorIntoDb = async (id: string) => {
  await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.$transaction(async (tClient) => {
    const doctorDeletedData = await tClient.doctor.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    await tClient.user.update({
      where: {
        email: doctorDeletedData?.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return doctorDeletedData;
  });

  return result;
};

export const DoctorService = {
  updateDoctorIntoDB,
  getAllDoctors,
  getDoctorFormDb,
  deleteDoctorFromDb,
  softDeleteDoctorIntoDb,
};
