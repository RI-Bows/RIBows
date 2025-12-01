import { PrismaClient, Role, Prisma } from '@prisma/client';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding the database');

  // Seed default Users
  for (const user of config.defaultUsers) {
    console.log(`  Creating/Updating user ${user.email}`);

    // eslint-disable-next-line no-await-in-loop
    const password = await hash(user.password, 10);
    const role = (user.role as Role) || Role.USER;

    // eslint-disable-next-line no-await-in-loop
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        password,
        role,
      },
    });
  }

  // Seed default RIOs
  if (config.defaultRios) {
    for (const rio of config.defaultRios) {
      console.log(`  Creating/Updating RIO ${rio.name}`);

      // Ensure Interest rows exist
      for (const interestName of rio.RioInterest ?? []) {
        // eslint-disable-next-line no-await-in-loop
        await prisma.interest.upsert({
          where: { name: interestName },
          update: {},
          create: { name: interestName },
        });
      }

      const primaryInterestName = Array.isArray(rio.RioInterest) && rio.RioInterest.length > 0
        ? String(rio.RioInterest[0])
        : undefined;

      // resolve interest id
      const primaryInterest = primaryInterestName
        // eslint-disable-next-line no-await-in-loop
        ? await prisma.interest.findFirst({ where: { name: primaryInterestName } })
        : null;

      if (!primaryInterest) {
        console.warn(`  Skipping RIO ${rio.name} because no primary interest found`);
      } else {
        // build typed create/update objects to satisfy Prisma typings
        const createData: Prisma.RioCreateInput = {
          name: rio.name,
          expirationDate: new Date(rio.expirationDate),
          purposeStatement: rio.purposeStatement ?? undefined,
          mainContact: rio.mainContact,
          email: rio.email,
          image: rio.image ?? undefined,
          approvalDate: rio.approvaleDate ? new Date(rio.approvaleDate) : new Date(),
          // connect expects InterestWhereUniqueInput
          interest: { connect: { id: primaryInterest.id } },
        };

        const updateData: Prisma.RioUpdateInput = {
          name: rio.name,
          expirationDate: new Date(rio.expirationDate),
          purposeStatement: rio.purposeStatement ?? undefined,
          mainContact: rio.mainContact,
          image: rio.image ?? undefined,
          approvalDate: rio.approvaleDate ? new Date(rio.approvaleDate) : new Date(),
          interest: { connect: { id: primaryInterest.id } },
        };

        // eslint-disable-next-line no-await-in-loop
        await prisma.rio.upsert({
          where: { name: rio.name },
          create: createData,
          update: updateData,
        });
      }
    }
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
