import prisma from "../../../shared/prisma";
import TAuthUser from "../../interfaces/common";

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

export const DoctorScheduleService = {
  insertDoctorScheduleIntoDB,
};
