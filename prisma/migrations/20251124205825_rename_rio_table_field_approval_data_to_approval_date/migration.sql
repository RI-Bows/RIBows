/*
  Warnings:

  - You are about to drop the column `approvalData` on the `Rio` table. All the data in the column will be lost.
  - Added the required column `approvalDate` to the `Rio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rio" DROP COLUMN "approvalData",
ADD COLUMN     "approvalDate" DATE NOT NULL;
