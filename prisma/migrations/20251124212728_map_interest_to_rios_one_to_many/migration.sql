/*
  Warnings:

  - You are about to drop the column `type` on the `Rio` table. All the data in the column will be lost.
  - You are about to drop the `RioInterest` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `interestName` to the `Rio` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RioInterest" DROP CONSTRAINT "RioInterest_interestId_fkey";

-- DropForeignKey
ALTER TABLE "RioInterest" DROP CONSTRAINT "RioInterest_rioId_fkey";

-- AlterTable
ALTER TABLE "Rio" DROP COLUMN "type",
ADD COLUMN     "interestName" TEXT NOT NULL;

-- DropTable
DROP TABLE "RioInterest";

-- AddForeignKey
ALTER TABLE "Rio" ADD CONSTRAINT "Rio_interestName_fkey" FOREIGN KEY ("interestName") REFERENCES "Interest"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
