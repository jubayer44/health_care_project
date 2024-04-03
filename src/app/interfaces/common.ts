import { UserRole } from "@prisma/client";

type TAuthUser = {
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
};

export default TAuthUser;
