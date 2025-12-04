'use server';

import { compare, hash } from 'bcrypt';
import { Interest, Rio } from '@prisma/client';
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

export async function updateUser(userId: number, newEmail: string | undefined, interests: Interest[]) {
  const emailToSet = newEmail?.toLowerCase?.() ?? newEmail;

  // Enforce domain policy: only allow @hawaii.edu addresses
  if (emailToSet && !emailToSet.endsWith('@hawaii.edu')) {
    throw new Error('INVALID_DOMAIN');
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      ...(emailToSet ? { email: emailToSet } : {}),
      interests: {
        set: [],
        connectOrCreate: interests.map((interest) => ({
          where: { name: interest.name },
          create: { name: interest.name },
        })),
      },
    },
  });
}

export type ParsedRioType = {
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
 * @param {ParsedRioType} rio: The RIO to upsert.
 */
export async function upsertRio(rio: ParsedRioType) {
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
 * @param {Array.<ParsedRioType>} rios: The RIOs to upsert.
 */
export async function upsertRios(rios: ParsedRioType[]) {
  for (const rio of rios) {
    // eslint-disable-next-line no-await-in-loop
    await upsertRio(rio);
  }
}

export type RioType = Rio & {
  interest: {
    name: string;
  };
};

/**
 * Retrieves all RIOs.
 * @returns {Promise<RioType[]>} The RIOs.
 */
export async function getRios(): Promise<RioType[]> {
  return prisma.rio.findMany({
    include: {
      interest: {
        select: {
          name: true,
        },
      },
    },
  });
}

/**
 * Retrieve RIO.
 * @param {string} name: The name of the RIO.
 * @returns {Promise<RioType | null>} The RIO.
 */
export async function getRio(name: string): Promise<RioType | null> {
  return prisma.rio.findFirst({
    where: {
      name,
    },
    include: {
      interest: {
        select: {
          name: true,
        },
      },
    },
  });
}

/**
 * Retrieves most popular RIOs.
 * @param {number} count: The number of RIOs to retrieve.
 * @returns {Promise<RioType[]>} The trending RIOs.
 */
export async function getTrendingRios(count: number): Promise<RioType[]> {
  return prisma.rio.findMany({
    take: count,
    orderBy: {
      bookmarks: 'desc',
    },
    include: {
      interest: {
        select: {
          name: true,
        },
      },
    },
  });
}

/**
 * Retrieves all interests.
 * @returns {Promise<Interest[]>} The interests.
 */
export async function getInterests(): Promise<Interest[]> {
  return prisma.interest.findMany();
}

/**
 * Creates a bookmark that maps the user to the RIO and increments the RIO bookmarks counter.
 * @param {string} email: The email of the user adding a bookmark.
 * @param {string} rioName: The name of the RIO to add a bookmark to.
 */
export async function addBookmark(email: string, rioName: string) {
  await prisma.$transaction(async (tx) => {
    const rio = await tx.rio.findUnique({
      where: { name: rioName },
    });
    if (!rio) {
      throw new Error(`RIO ${rioName} does not exist`);
    }
    const user = await tx.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new Error(`User with email ${email} does not exist`);
    }

    // Prevent duplicate bookmarks
    const alreadyBookmarked = await tx.user.findFirst({
      where: {
        email,
        rios: {
          some: { name: rioName },
        },
      },
      select: { id: true },
    });

    if (alreadyBookmarked) {
      return;
    }

    // Update user's connected RIOs
    await tx.user.update({
      where: { email },
      data: {
        rios: {
          connect: { id: rio.id },
        },
      },
    });

    // Update RIO's bookmarks counter
    await tx.rio.update({
      where: { name: rioName },
      data: {
        bookmarks: {
          increment: 1,
        },
      },
    });
  });
}

/**
 * Retrieve bookmarked RIOs.
 * @param {string} email: The email of the user.
 * @returns {Promise<RioType[] | null>} The RIOs.
 */
export async function getBookmarkedRios(email: string): Promise<RioType[] | null> {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      rios: {
        include: {
          interest: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error(`User with email ${email} does not exist`);
  }

  return user.rios;
}

/**
 * Retrieves a single RIO by its ID.
 * @param {number} id - The RIO's unique ID.
 * @returns {Promise<RioType | null>}
 */
export async function getRioById(id: number): Promise<RioType | null> {
  return prisma.rio.findUnique({
    where: { id },
    include: {
      interest: {
        select: { name: true },
      },
    },
  });
}
