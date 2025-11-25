/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Rio` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Rio_email_key" ON "Rio"("email");
