-- CreateTable
CREATE TABLE "Tagesmutter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "einrichtungsname" TEXT,
    "fotoUrl" TEXT NOT NULL,
    "einrichtungsfotoUrls" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "telefon" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "oeffnungszeiten" TEXT NOT NULL,
    "ersatzbetreuung" TEXT NOT NULL,
    "verpflegung" TEXT NOT NULL,
    "websiteUrl" TEXT,
    "beratungsgebiet" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "istAktiv" BOOLEAN NOT NULL DEFAULT true,
    "reihenfolge" INTEGER NOT NULL DEFAULT 0,
    "erstelltAm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aktualisiertAm" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "titel" TEXT NOT NULL,
    "kurztext" TEXT NOT NULL,
    "inhaltMd" TEXT NOT NULL,
    "titelbildUrl" TEXT,
    "veroeffentlichtAm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "istEntwurf" BOOLEAN NOT NULL DEFAULT false,
    "aktualisiertAm" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Banner" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bezeichnung" TEXT NOT NULL,
    "notizen" TEXT
);

-- CreateTable
CREATE TABLE "Buchung" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bannerId" TEXT NOT NULL,
    "tagesmutterId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ANFRAGE',
    "zeitraumStart" DATETIME NOT NULL,
    "zeitraumEnde" DATETIME NOT NULL,
    "notizenAdmin" TEXT,
    "erstelltAm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aktualisiertAm" DATETIME NOT NULL,
    CONSTRAINT "Buchung_bannerId_fkey" FOREIGN KEY ("bannerId") REFERENCES "Banner" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Buchung_tagesmutterId_fkey" FOREIGN KEY ("tagesmutterId") REFERENCES "Tagesmutter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Tagesmutter_slug_key" ON "Tagesmutter"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE INDEX "Buchung_bannerId_zeitraumStart_zeitraumEnde_idx" ON "Buchung"("bannerId", "zeitraumStart", "zeitraumEnde");
