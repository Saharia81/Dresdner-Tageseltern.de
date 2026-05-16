/*
  Warnings:

  - You are about to drop the column `adresse` on the `Tagesmutter` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Tagesmutter` table. All the data in the column will be lost.
  - The required column `emailToken` was added to the `Tagesmutter` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `nachname` to the `Tagesmutter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plz` to the `Tagesmutter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stadtteil` to the `Tagesmutter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `strasse` to the `Tagesmutter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vorname` to the `Tagesmutter` table without a default value. This is not possible if the table is not empty.
  - Made the column `einrichtungsname` on table `Tagesmutter` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "FreiePlaetze" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tagesmutterId" TEXT NOT NULL,
    "platz1Ab" DATETIME,
    "platz2Ab" DATETIME,
    "platz3Ab" DATETIME,
    "platz4Ab" DATETIME,
    "platz5Ab" DATETIME,
    "aktualisiertAm" DATETIME NOT NULL,
    CONSTRAINT "FreiePlaetze_tagesmutterId_fkey" FOREIGN KEY ("tagesmutterId") REFERENCES "Tagesmutter" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tagesmutter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "vorname" TEXT NOT NULL,
    "nachname" TEXT NOT NULL,
    "einrichtungsname" TEXT NOT NULL,
    "fotoUrl" TEXT NOT NULL,
    "einrichtungsfotoUrls" TEXT NOT NULL,
    "strasse" TEXT NOT NULL,
    "plz" TEXT NOT NULL,
    "stadtteil" TEXT NOT NULL,
    "latitude" REAL,
    "longitude" REAL,
    "telefon" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "websiteUrl" TEXT,
    "oeffnungszeiten" TEXT NOT NULL,
    "ersatzbetreuung" TEXT NOT NULL,
    "verpflegung" TEXT NOT NULL,
    "beratungsgebiet" TEXT NOT NULL,
    "schmetterling" BOOLEAN NOT NULL DEFAULT false,
    "schmetterlingPartner" TEXT,
    "mitgliedsnummer" TEXT,
    "mitgliedSeit" DATETIME,
    "emailToken" TEXT NOT NULL,
    "lastConfirmed" DATETIME,
    "istAktiv" BOOLEAN NOT NULL DEFAULT true,
    "reihenfolge" INTEGER NOT NULL DEFAULT 0,
    "erstelltAm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aktualisiertAm" DATETIME NOT NULL
);
INSERT INTO "new_Tagesmutter" ("aktualisiertAm", "beratungsgebiet", "einrichtungsfotoUrls", "einrichtungsname", "email", "ersatzbetreuung", "erstelltAm", "fotoUrl", "id", "istAktiv", "latitude", "longitude", "oeffnungszeiten", "reihenfolge", "slug", "telefon", "verpflegung", "websiteUrl") SELECT "aktualisiertAm", "beratungsgebiet", "einrichtungsfotoUrls", "einrichtungsname", "email", "ersatzbetreuung", "erstelltAm", "fotoUrl", "id", "istAktiv", "latitude", "longitude", "oeffnungszeiten", "reihenfolge", "slug", "telefon", "verpflegung", "websiteUrl" FROM "Tagesmutter";
DROP TABLE "Tagesmutter";
ALTER TABLE "new_Tagesmutter" RENAME TO "Tagesmutter";
CREATE UNIQUE INDEX "Tagesmutter_slug_key" ON "Tagesmutter"("slug");
CREATE UNIQUE INDEX "Tagesmutter_email_key" ON "Tagesmutter"("email");
CREATE UNIQUE INDEX "Tagesmutter_emailToken_key" ON "Tagesmutter"("emailToken");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "FreiePlaetze_tagesmutterId_key" ON "FreiePlaetze"("tagesmutterId");
