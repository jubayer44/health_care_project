import prisma from "../../../shared/prisma";

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

export const DoctorService = {
  updateDoctorIntoDB,
};
