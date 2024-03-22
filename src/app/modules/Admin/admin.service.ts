import { Admin, Prisma, UserStatus } from "@prisma/client";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import prisma from "../../../shared/prisma";
import { searchAbleFields } from "./admin.constant";
import { TParams } from "./admin.interface";
import { TPagination } from "../../interfaces/pagination";

const getAllAdmins = async (params: TParams, options: TPagination) => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...restData } = params;
  const andConditions: Prisma.AdminWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: searchAbleFields?.map((field) => ({
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

  const whereConditions: Prisma.AdminWhereInput = { AND: andConditions };

  const result = await prisma.admin.findMany({
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
  });

  const total = await prisma.admin.count({
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

const getAdminFormDb = async (id: string): Promise<Admin | null> => {
  const result = await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  return result;
};

const updateAdminIntoDb = async (
  id: string,
  data: Partial<Admin>
): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.admin.update({
    where: { id },
    data,
  });
  return result;
};

const deleteAdminFromDb = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: { id },
  });
  const result = await prisma.$transaction(async (tClient) => {
    const adminDeletedData = await tClient.admin.delete({
      where: { id },
    });

    await tClient.user.delete({
      where: {
        email: adminDeletedData?.email,
      },
    });
    return adminDeletedData;
  });

  return result;
};

const softDeleteAdminIntoDb = async (id: string) => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.$transaction(async (tClient) => {
    const adminDeletedData = await tClient.admin.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    await tClient.user.update({
      where: {
        email: adminDeletedData?.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return adminDeletedData;
  });

  return result;
};

export const AdminService = {
  getAllAdmins,
  getAdminFormDb,
  updateAdminIntoDb,
  deleteAdminFromDb,
  softDeleteAdminIntoDb,
};
