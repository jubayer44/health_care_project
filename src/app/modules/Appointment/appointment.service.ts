import prisma from "../../../shared/prisma";
import TAuthUser from "../../interfaces/common";
import { v4 as uuidv4 } from "uuid";
import { TPagination } from "../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import { Prisma, UserRole } from "@prisma/client";

const createAppointmentIntoDB = async (user: TAuthUser, payload: any) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const doctor = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload?.doctorId,
    },
  });

  await prisma.doctorSchedules.findFirstOrThrow({
    where: {
      doctorId: doctor.id,
      scheduleId: payload?.scheduleId,
      isBooked: false,
    },
  });

  const videoCallingId: string = uuidv4();

  const result = await prisma.$transaction(async (tx) => {
    const appointmentData = await tx.appointment.create({
      data: {
        patientId: patientData.id,
        doctorId: doctor.id,
        scheduleId: payload.scheduleId,
        videoCallingId,
      },
      include: {
        patient: true,
        doctor: true,
        schedule: true,
      },
    });

    await tx.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: doctor.id,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
        appointmentId: appointmentData.id,
      },
    });

    const today = new Date();

    const transactionId =
      "PH-Health-Care" +
      today.getFullYear() +
      "-" +
      today.getMonth() +
      "-" +
      today.getDate() +
      "-" +
      today.getHours() +
      "-" +
      today.getMinutes() +
      "-" +
      today.getSeconds();

    await tx.payment.create({
      data: {
        appointmentId: appointmentData.id,
        amount: doctor.appointmentFee,
        transactionId,
      },
    });

    return appointmentData;
  });

  return result;
};

const getMyAppointmentFromDB = async (
  user: TAuthUser,
  params: any,
  options: TPagination
) => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { ...filterData } = params;

  const andConditions: Prisma.AppointmentWhereInput[] = [];

  if (Object.keys(filterData)?.length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: (filterData as any)[key],
      })),
    });
  }

  if (user.role === UserRole.PATIENT) {
    andConditions.push({
      patient: {
        email: user.email,
      },
    });
  } else if (user.role === UserRole.DOCTOR) {
    andConditions.push({
      doctor: {
        email: user.email,
      },
    });
  }

  const whereConditions: Prisma.AppointmentWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.appointment.findMany({
    where: whereConditions,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
    include:
      user.role === UserRole.PATIENT
        ? { doctor: true, schedule: true }
        : {
            patient: {
              include: { patientHealthData: true, medicalReport: true },
            },
            schedule: true,
          },
    skip,
    take: limit,
  });

  const total = await prisma.appointment.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

export const AppointmentService = {
  createAppointmentIntoDB,
  getMyAppointmentFromDB,
};
