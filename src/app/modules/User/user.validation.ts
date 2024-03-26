import { z } from "zod";

const createAdminValidationSchema = z.object({
  password: z.string(),
  admin: z.object({
    name: z.string(),
    email: z.string().email(),
    contactNumber: z.string(),
    profilePhoto: z.string().optional(),
  }),
});

const createDoctorValidationSchema = z.object({
  password: z.string(),
  doctor: z.object({
    name: z.string(),
    email: z.string().email(),
    contactNumber: z.string(),
    profilePhoto: z.string().optional(),
    address: z.string().optional(),
    registrationNumber: z.string(),
    experience: z.string().optional(),
    gender: z.enum(["MALE", "FEMALE"]),
    appointmentFee: z.number(),
    qualification: z.string(),
    currentWorkingPlace: z.string().optional(),
    designation: z.string(),
    averageRating: z.number().optional(),
  }),
});

const createPatientValidationSchema = z.object({
  password: z.string(),
  patient: z.object({
    name: z.string(),
    email: z.string().email(),
    contactNumber: z.string(),
    profilePhoto: z.string().optional(),
    address: z.string().optional(),
  }),
});

export const UserValidationSchemas = {
  createAdminValidationSchema,
  createDoctorValidationSchema,
  createPatientValidationSchema,
};
