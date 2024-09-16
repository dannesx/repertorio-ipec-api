-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "musics" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "key" TEXT,
    "tempo" TEXT,
    "bpm" INTEGER,
    "lyrics" TEXT,
    "chords" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "themes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "references" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "book" TEXT NOT NULL,
    "chapter" INTEGER NOT NULL,
    "musicId" INTEGER,
    CONSTRAINT "references_musicId_fkey" FOREIGN KEY ("musicId") REFERENCES "musics" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_MusicThemes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_MusicThemes_A_fkey" FOREIGN KEY ("A") REFERENCES "musics" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MusicThemes_B_fkey" FOREIGN KEY ("B") REFERENCES "themes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "themes_name_key" ON "themes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_MusicThemes_AB_unique" ON "_MusicThemes"("A", "B");

-- CreateIndex
CREATE INDEX "_MusicThemes_B_index" ON "_MusicThemes"("B");
