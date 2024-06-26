import { z } from "zod";

const create = z.object({
  title: z.string({
    required_error: "title is required",
    invalid_type_error: "title must be a string",
  }),
});

export const SpecialtiesValidationSchemas = {
  create,
};
