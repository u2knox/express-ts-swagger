-- CreateTable
CREATE TABLE "_TokenFollows" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_TokenFollows_A_fkey" FOREIGN KEY ("A") REFERENCES "Token" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TokenFollows_B_fkey" FOREIGN KEY ("B") REFERENCES "Token" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_TokenFollows_AB_unique" ON "_TokenFollows"("A", "B");

-- CreateIndex
CREATE INDEX "_TokenFollows_B_index" ON "_TokenFollows"("B");
