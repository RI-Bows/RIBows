'use server';

import { compare, hash } from 'bcrypt';
import { Interest } from '@prisma/client';
import { prisma } from './prisma';

export async function getUser(email: string) {
  // console.log(`getUser data: ${email}`);
  // eslint-disable-next-line @typescript-eslint/return-await
  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function checkPassword(credentials: { email: string; password: string }) {
  // console.log(`checkPassword data: ${JSON.stringify(credentials, null, 2)}`);
  const user = await getUser(credentials.email);
  if (!user) {
    return false;
  }
  // eslint-disable-next-line @typescript-eslint/return-await
  return await compare(credentials.password, user.password);
}

export async function changePassword(credentials: { email: string; password: string }) {
  // console.log(`changePassword data: ${JSON.stringify(credentials, null, 2)}`);
  const password = await hash(credentials.password, 10);
  await prisma.user.update({
    where: { email: credentials.email },
    data: {
      password,
    },
  });
}

// TODO: Delete this eslint override once DB updated
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function createUser(credentials: { email: string; password: string }, interests: Interest[]) {
  // console.log(`createUser data: ${JSON.stringify(credentials, null, 2)}`);
  const password = await hash(credentials.password, 10);
  await prisma.user.create({
    data: {
      email: credentials.email,
      password,
      interests: {
        connectOrCreate: interests.map((interest) => ({
          where: { name: interest.name },
          create: { name: interest.name },
        }))
      },
    },
  });
}

export async function createProject(project: any) {
  // console.log(`createProject data: ${JSON.stringify(project, null, 2)}`);
  const dbProject = await prisma.project.create({
    data: project,
  });
  return dbProject;
}

export type TrendingRio = {
  id: number;
  name: string;
  blurb: string;
  count: number;
};

// EC 11/24/25 - Commenting this out for now since schema was just updated and
// popularity should be determined by something like number of bookmarks
// TODO: Update this logic and reimplement it in the search/trending page
// export const getTrendingRios = async (limit = 9): Promise<TrendingRio[]> => {
//   const rios = await prisma.rio.findMany({
//     take: limit,
//     orderBy: {
//       RioInterest: {
//         _count: 'desc',
//       },
//     },
//     include: {
//       _count: {
//         select: { RioInterest: true },
//       },
//     },
//   });
//
//   return rios.map((r) => ({
//     id: r.id,
//     name: r.name,
//     blurb: r.purposeStatement ?? 'No description yet.',
//     // eslint-disable-next-line no-underscore-dangle
//     count: r._count?.RioInterest ?? 0,
//   }));
// };

export type RioType = {
  name: string;
  approvalDate: Date;
  expirationDate: Date;
  purposeStatement: string | null;
  interestName: string;
  mainContact: string;
  email: string;
  image: string | null;
};

/**
 * Upserts an rio.
 * @param {RioType} rio: The RIO to upsert.
 */
export async function upsertRio(rio: RioType) {
  const interest = await prisma.interest.upsert({
    where: { name: rio.interestName },
    update: {},
    create: { name: rio.interestName },
  });

  await prisma.rio.upsert({
    where: { name: rio.name },
    update: {
      approvalDate: rio.approvalDate,
      expirationDate: rio.expirationDate,
      purposeStatement: rio.purposeStatement,
      interestId: interest.id,
      mainContact: rio.mainContact,
      email: rio.email,
      image: rio.image,
    },
    create: {
      name: rio.name,
      approvalDate: rio.approvalDate,
      expirationDate: rio.expirationDate,
      purposeStatement: rio.purposeStatement,
      interestId: interest.id,
      mainContact: rio.mainContact,
      email: rio.email,
      image: rio.image,
    },
  });
}

/**
 * Bulk upserts multiple rios.
 * @param {Array.<RioType>} rios: The RIOs to upsert.
 */
export async function upsertRios(rios: RioType[]) {
  for (const rio of rios) {
    // eslint-disable-next-line no-await-in-loop
    await upsertRio(rio);
  }
}

/**
 * Retrieves all interests.
 * @returns {Promise<Interest[]>} The interests.
 */
export async function getInterests(): Promise<Interest[]> {
  return await prisma.interest.findMany();
}

export async function upsertProject(project: any) {
  // console.log(`upsertProject data: ${JSON.stringify(project, null, 2)}`);
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
  project.interests.forEach(async (interest: string) => {
    const dbInterest = await prisma.interest.findUnique({
      where: { name: interest },
    });
    // console.log(`${dbProject.name} ${dbInterest!.name}`);
    const dbProjectInterest = await prisma.projectInterest.findMany({
      where: { projectId: dbProject.id, interestId: dbInterest!.id },
    });
    if (dbProjectInterest.length === 0) {
      await prisma.projectInterest.create({
        data: {
          projectId: dbProject.id,
          interestId: dbInterest!.id,
        },
      });
    }
  });
  project.participants.forEach(async (email: string) => {
    const dbProfile = await prisma.profile.findUnique({
      where: { email },
    });
    const dbProfileProject = await prisma.profileProject.findMany({
      where: { projectId: dbProject.id, profileId: dbProfile!.id },
    });
    if (dbProfileProject.length === 0) {
      await prisma.profileProject.create({
        data: {
          projectId: dbProject.id,
          profileId: dbProfile!.id,
        },
      });
    }
  });
  return dbProject;
}

export async function updateProfile(profile: any) {
  console.log(`updateProfile data: ${JSON.stringify(profile, null, 2)}`);
  const dbProfile = await prisma.profile.upsert({
    where: { email: profile.email },
    update: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      bio: profile.bio,
    },
    create: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      bio: profile.bio,
      email: profile.email,
    },
  });
  if (profile.interests) {
    // Delete all profile interests
    await prisma.profileInterest.deleteMany({
      where: { profileId: dbProfile.id },
    });
    // Add the new profile interests
    profile.interests.forEach(async (intere: string) => {
      const dbInterest = await prisma.interest.findUnique({
        where: { name: intere },
      });
      await prisma.profileInterest.create({
        data: {
          profileId: dbProfile.id,
          interestId: dbInterest!.id,
        },
      });
    });
  }
  if (profile.projects) {
    // Delete all profile projects
    await prisma.profileProject.deleteMany({
      where: { profileId: dbProfile.id },
    });
    // Delete all the profile projects
    await prisma.profileProject.deleteMany({
      where: { profileId: dbProfile.id },
    });
    // Add the new profile projects
    profile.projects.forEach(async (projectName: string) => {
      const dbProject = await prisma.project.findUnique({
        where: { name: projectName },
      });
      await prisma.profileProject.create({
        data: {
          profileId: dbProfile.id,
          projectId: dbProject!.id,
        },
      });
    });
  }
  return dbProfile;
}
