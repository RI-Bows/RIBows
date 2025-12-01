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

export async function createUser(credentials: { email: string; password: string }, interests: Interest[]) {
  // console.log(`createUser data: ${JSON.stringify(credentials, null, 2)}`);
  const email = credentials.email?.toLowerCase?.() ?? credentials.email;

  // Enforce domain policy: only allow @hawaii.edu addresses
  if (!email || !email.endsWith('@hawaii.edu')) {
    throw new Error('INVALID_DOMAIN');
  }

  // Pre-check for existing user to provide a friendly error message
  const existing = await getUser(email);
  if (existing) {
    throw new Error('DUPLICATE_EMAIL');
  }

  const password = await hash(credentials.password, 10);

  await prisma.user.create({
    data: {
      email,
      password,
      // role defaults to USER in schema; explicit assignment kept out to avoid accidental privilege elevation
      interests: {
        connectOrCreate: interests.map((interest) => ({
          where: { name: interest.name },
          create: { name: interest.name },
        })),
      },
    },
  });
}

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
      // image: rio.image,
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
  return prisma.interest.findMany();
}
