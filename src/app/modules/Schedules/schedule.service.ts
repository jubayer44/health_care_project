import { Prisma, Schedule } from "@prisma/client";
import { addHours, addMinutes, format } from "date-fns";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import prisma from "../../../shared/prisma";
import { TPagination } from "../../interfaces/pagination";
import { TFilterRequest, TSchedule } from "./schedule.interface";
import TAuthUser from "../../interfaces/common";

const getScheduleFromDB = async (
  params: TFilterRequest,
  options: TPagination,
  user: TAuthUser
) => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { startDate, endDate, ...restData } = params;

  const andConditions: Prisma.ScheduleWhereInput[] = [];

  if (Object.keys(restData)?.length > 0) {
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
          startDateTime: {
            gte: startDate,
          },
        },
        {
          endDateTime: {
            lte: endDate,
          },
        },
      ],
    });
  }

  const whereConditions: Prisma.ScheduleWhereInput = { AND: andConditions };

  const doctorSchedule = await prisma.doctorSchedules.findMany({
    where: {
      doctor: {
        email: user.email,
      },
    },
  });

  const doctorScheduleIds = doctorSchedule.map(
    (schedule) => schedule.scheduleId
  );

  const result = await prisma.schedule.findMany({
    where: {
      ...whereConditions,
      id: { notIn: doctorScheduleIds },
    },
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

  const total = await prisma.schedule.count({
    where: {
      ...whereConditions,
      id: { notIn: doctorScheduleIds },
    },
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

const insertScheduleIntoDB = async (
  payload: TSchedule
): Promise<Schedule[] | null> => {
  const { startDate, endDate, startTime, endTime } = payload;

  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  const intervalTime = 30;

  const schedules = [];

  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );

    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );

    while (startDateTime < endDateTime) {
      const scheduleData = {
        startDateTime: startDateTime,
        endDateTime: addMinutes(startDateTime, intervalTime),
      };

      const existingSchedule = await prisma.schedule.findFirst({
        where: {
          startDateTime: scheduleData.startDateTime,
          endDateTime: scheduleData.endDateTime,
        },
      });
      if (!existingSchedule) {
        const result = await prisma.schedule.create({
          data: scheduleData,
        });

        schedules.push(result);
      }

      startDateTime.setMinutes(startDateTime.getMinutes() + intervalTime);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }
  return schedules;
};

export const ScheduleService = {
  insertScheduleIntoDB,
  getScheduleFromDB,
};
