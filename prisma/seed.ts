import { PrismaClient, Role, Prisma } from '@prisma/client';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding the database');

  for (const project of config.defaultProjects) {
    console.log(`  Creating/Updating project ${project.name}`);
    for (const interest of project.interests) {
      // console.log(`Project ${project.name} ${interest}`);
      // eslint-disable-next-line no-await-in-loop
      await prisma.interest.upsert({
        where: { name: interest },
        update: {},
        create: { name: interest },
      });
      // eslint-disable-next-line no-await-in-loop
      const dbProject = await prisma.project.upsert({
        where: { name: project.name },
        update: {},
        create: {
          name: project.name,
          description: project.description,
          homepage: project.homepage,
          picture: project.picture,
        },
      });
      for (const intere of project.interests) {
        // eslint-disable-next-line no-await-in-loop
        const dbInterest = await prisma.interest.findUnique({
          where: { name: intere },
        });
        // console.log(`${dbProject.name} ${dbInterest!.name}, ${dbInterest}`);
        // eslint-disable-next-line no-await-in-loop
        const dbProjectInterest = await prisma.projectInterest.findMany({
          where: { projectId: dbProject.id, interestId: dbInterest!.id },
        });
        if (dbProjectInterest.length === 0) {
          // eslint-disable-next-line no-await-in-loop
          await prisma.projectInterest.create({
            data: {
              projectId: dbProject.id,
              interestId: dbInterest!.id,
            },
          });
        }
      }
    }
  }

  const password = await hash('foo', 10);

  for (const profile of config.defaultProfiles) {
    console.log(`  Creating/Updating profile ${profile.email}`);
    // upsert interests from the profile
    for (const interest of profile.interests) {
      // eslint-disable-next-line no-await-in-loop
      await prisma.interest.upsert({
        where: { name: interest },
        update: {},
        create: { name: interest },
      });
    }
    // Upsert/Create the user so they can login.
    const role = (profile.role as Role) || Role.USER;
    // console.log(`  Creating user: ${profile.email} with role: ${role}`);
    // eslint-disable-next-line no-await-in-loop
    await prisma.user.upsert({
      where: { email: profile.email },
      update: {},
      create: {
        email: profile.email,
        password,
        role,
      },
    });
    // Upsert/Create the profile.
    // eslint-disable-next-line no-await-in-loop
    const dbProfile = await prisma.profile.upsert({
      where: { email: profile.email },
      update: {},
      create: {
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        bio: profile.bio,
        picture: profile.picture,
      },
    });
    for (const interest of profile.interests) {
      // eslint-disable-next-line no-await-in-loop
      const dbInterest = await prisma.interest.findUnique({
        where: { name: interest },
      });
      // console.log(`${dbProfile.firstName} ${dbInterest!.name}`);
      // eslint-disable-next-line no-await-in-loop
      const dbProfileInterest = await prisma.profileInterest.findMany({
        where: { profileId: dbProfile.id, interestId: dbInterest!.id },
      });
      if (dbProfileInterest.length === 0) {
        // Create the profile interest
        // eslint-disable-next-line no-await-in-loop
        await prisma.profileInterest.create({
          data: {
            profileId: dbProfile.id,
            interestId: dbInterest!.id,
          },
        });
      }
    }
    // Upsert/Create the profile projects
    for (const project of profile.projects) {
      // console.log(`Project member ${dbProfile.firstName} ${project}`);
      // eslint-disable-next-line no-await-in-loop
      const dbProject = await prisma.project.findFirst({
        where: { name: project },
      });
      const dbProfileProject = dbProject
        // eslint-disable-next-line no-await-in-loop
        ? await prisma.profileProject.findMany({
          where: { profileId: dbProfile.id, projectId: dbProject.id },
        })
        : [];
      if (dbProject && dbProfileProject.length === 0) {
        // Create the profile project
        // eslint-disable-next-line no-await-in-loop
        await prisma.profileProject.create({
          data: {
            profileId: dbProfile.id,
            projectId: dbProject.id,
          },
        });
      }
    }
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
