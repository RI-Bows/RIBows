/*
  Warnings:

  - You are about to drop the column `dateApproved` on the `Rio` table. All the data in the column will be lost.
  - Added the required column `approvalData` to the `Rio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rio" DROP COLUMN "dateApproved",
ADD COLUMN     "approvalData" DATE NOT NULL;
