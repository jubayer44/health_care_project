import * as bcrypt from "bcrypt";
import { UserRole } from "@prisma/client";
import prisma from "../src/shared/prisma";

const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExists = await prisma.user.findFirst({
      where: {
        role: UserRole.SUPER_ADMIN,
      },
    });

    if (isSuperAdminExists) {
      console.log("Super Admin Already Exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("123456", 12);

    const result = await prisma.user.create({
      data: {
        email: "superadmin@ph.com",
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
        admin: {
          create: {
            name: "Super Admin",
            // email: "superadmin@ph.com", // j field er sathe relation thake seta na dile hoy
            contactNumber: "01838483948",
          },
        },
      },
    });

    console.log(result);
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
};

seedSuperAdmin();
