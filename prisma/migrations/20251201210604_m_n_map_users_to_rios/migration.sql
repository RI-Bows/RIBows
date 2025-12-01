-- CreateTable
CREATE TABLE "_RioToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_RioToUser_AB_unique" ON "_RioToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RioToUser_B_index" ON "_RioToUser"("B");

-- AddForeignKey
ALTER TABLE "_RioToUser" ADD CONSTRAINT "_RioToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Rio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RioToUser" ADD CONSTRAINT "_RioToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
