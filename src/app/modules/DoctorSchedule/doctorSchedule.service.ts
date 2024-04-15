import { Prisma } from "@prisma/client";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import prisma from "../../../shared/prisma";
import TAuthUser from "../../interfaces/common";
import { TPagination } from "../../interfaces/pagination";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const getMyScheduleFromDB = async (
  params: any,
  options: TPagination,
  user: TAuthUser
) => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { startDate, endDate, ...restData } = params;

  const userData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const andConditions: Prisma.DoctorSchedulesWhereInput[] = [];

  if (Object.keys(restData)?.length > 0) {
    if (
      typeof restData?.isBooked === "string" &&
      restData.isBooked === "true"
    ) {
      restData.isBooked = true;
    } else if (
      typeof restData?.isBooked === "string" &&
      restData.isBooked === "false"
    ) {
      restData.isBooked = false;
    }
    andConditions.push({
      AND: Object.keys(restData).map((key) => ({
        [key]: (restData as any)[key],
      })),
    });
  }

  if (startDate && endDate) {
    andConditions.push({
      AND: [
        {
          schedule: {
            startDateTime: {
              gte: startDate,
            },
          },
        },
        {
          schedule: {
            endDateTime: {
              lte: endDate,
            },
          },
        },
      ],
    });
  }

  const whereConditions: Prisma.DoctorSchedulesWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.doctorSchedules.findMany({
    where: {
      ...whereConditions,
      doctorId: userData.id,
    },
    skip,
    take: limit,
    orderBy:
      options?.sortBy && options?.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {},
  });

  const total = await prisma.doctorSchedules.count({
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

const insertDoctorScheduleIntoDB = async (
  user: TAuthUser,
  payload: {
    scheduleIds: string[];
  }
) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const doctorScheduleData = payload.scheduleIds.map((scheduleId) => ({
    doctorId: doctorData.id,
    scheduleId,
  }));
  const result = await prisma.doctorSchedules.createMany({
    data: doctorScheduleData,
  });

  return result;
};

const deleteDoctorScheduleFromDB = async (
  user: TAuthUser,
  scheduleId: string
) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const isBookedSchedule = await prisma.doctorSchedules.findFirst({
    where: {
      doctorId: doctorData.id,
      scheduleId: scheduleId,
      isBooked: true,
    },
  });

  if (isBookedSchedule) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You can not delete this schedule because it is already booked"
    );
  }

  const result = await prisma.doctorSchedules.delete({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorData.id,
        scheduleId: scheduleId,
      },
    },
  });

  return result;
};

export const DoctorScheduleService = {
  insertDoctorScheduleIntoDB,
  getMyScheduleFromDB,
  deleteDoctorScheduleFromDB,
};
