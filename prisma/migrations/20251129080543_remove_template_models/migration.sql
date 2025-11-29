/*
  Warnings:

  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProfileInterest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProfileProject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectInterest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProfileInterest" DROP CONSTRAINT "ProfileInterest_interestId_fkey";

-- DropForeignKey
ALTER TABLE "ProfileInterest" DROP CONSTRAINT "ProfileInterest_profileId_fkey";

-- DropForeignKey
ALTER TABLE "ProfileProject" DROP CONSTRAINT "ProfileProject_profileId_fkey";

-- DropForeignKey
ALTER TABLE "ProfileProject" DROP CONSTRAINT "ProfileProject_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectInterest" DROP CONSTRAINT "ProjectInterest_interestId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectInterest" DROP CONSTRAINT "ProjectInterest_projectId_fkey";

-- DropTable
DROP TABLE "Profile";

-- DropTable
DROP TABLE "ProfileInterest";

-- DropTable
DROP TABLE "ProfileProject";

-- DropTable
DROP TABLE "Project";

-- DropTable
DROP TABLE "ProjectInterest";
