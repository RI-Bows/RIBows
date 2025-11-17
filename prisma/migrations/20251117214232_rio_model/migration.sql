-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'CLUB';

-- CreateTable
CREATE TABLE "Rio" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "dateApproved" DATE NOT NULL,
    "expirationDate" DATE NOT NULL,
    "purposeStatement" TEXT,
    "type" TEXT NOT NULL,
    "mainContact" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "Rio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RioInterest" (
    "id" SERIAL NOT NULL,
    "rioId" INTEGER NOT NULL,
    "interestId" INTEGER NOT NULL,

    CONSTRAINT "RioInterest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rio_name_key" ON "Rio"("name");

-- AddForeignKey
ALTER TABLE "RioInterest" ADD CONSTRAINT "RioInterest_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "Interest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RioInterest" ADD CONSTRAINT "RioInterest_rioId_fkey" FOREIGN KEY ("rioId") REFERENCES "Rio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
