/*
  Warnings:

  - You are about to drop the column `interestName` on the `Rio` table. All the data in the column will be lost.
  - Added the required column `interestId` to the `Rio` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Rio" DROP CONSTRAINT "Rio_interestName_fkey";

-- AlterTable
ALTER TABLE "Rio" DROP COLUMN "interestName",
ADD COLUMN     "interestId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Rio" ADD CONSTRAINT "Rio_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "Interest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
