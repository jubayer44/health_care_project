import { UserRole } from "@prisma/client";

type TAuthUser = {
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
};

export type TParams = {
  name?: string | undefined;
  email?: string | undefined;
  contactNumber?: string | undefined;
  searchTerm?: string | undefined;
  specialties?: string | undefined;
};

export default TAuthUser;
