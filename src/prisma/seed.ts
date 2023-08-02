import { PrismaClient } from '@prisma/client';
import { PermissionEnum } from '../shared/enums/permission.enum';
import { RoleEnum } from '../shared/enums/role.enum';

const prisma = new PrismaClient();
async function main() {
  for (const role of Object.values(RoleEnum)) {
    await prisma.role.upsert({
      where: {
        name: role,
      },
      create: {
        name: role,
        createdBy: 'system',
        updatedBy: 'system',
      },
      update: {},
    });
  }

  for (const permission of Object.values(PermissionEnum)) {
    await prisma.permission.upsert({
      where: {
        name: permission,
      },
      create: {
        name: permission,
        permission2role: {
          create: {
            role: {
              connect: {
                name: RoleEnum.Admin,
              },
            },
          },
        },
        createdBy: 'system',
        updatedBy: 'system',
      },
      update: {},
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
