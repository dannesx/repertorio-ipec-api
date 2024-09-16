/*
  Warnings:

  - You are about to drop the column `book` on the `references` table. All the data in the column will be lost.
  - You are about to drop the column `chapter` on the `references` table. All the data in the column will be lost.
  - You are about to drop the column `musicId` on the `references` table. All the data in the column will be lost.
  - Added the required column `name` to the `references` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "_MusicReferences" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_MusicReferences_A_fkey" FOREIGN KEY ("A") REFERENCES "musics" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MusicReferences_B_fkey" FOREIGN KEY ("B") REFERENCES "references" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_references" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);
INSERT INTO "new_references" ("id") SELECT "id" FROM "references";
DROP TABLE "references";
ALTER TABLE "new_references" RENAME TO "references";
CREATE UNIQUE INDEX "references_name_key" ON "references"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_MusicReferences_AB_unique" ON "_MusicReferences"("A", "B");

-- CreateIndex
CREATE INDEX "_MusicReferences_B_index" ON "_MusicReferences"("B");
