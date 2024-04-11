/*
  Warnings:

  - You are about to drop the column `access_token` on the `AccessToken` table. All the data in the column will be lost.
  - Added the required column `accessToken` to the `AccessToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `AccessToken` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AccessToken" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "accessToken" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    CONSTRAINT "AccessToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AccessToken" ("id", "userId") SELECT "id", "userId" FROM "AccessToken";
DROP TABLE "AccessToken";
ALTER TABLE "new_AccessToken" RENAME TO "AccessToken";
CREATE UNIQUE INDEX "AccessToken_accessToken_key" ON "AccessToken"("accessToken");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
