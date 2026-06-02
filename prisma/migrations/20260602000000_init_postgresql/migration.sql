-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Beratungsgebiet" AS ENUM ('MALWINA', 'OUTLAW', 'KINDERLAND');

-- CreateEnum
CREATE TYPE "Verpflegung" AS ENUM ('SELBST_GEKOCHT', 'CATERING');

-- CreateEnum
CREATE TYPE "BuchungsStatus" AS ENUM ('ANFRAGE', 'BESTAETIGT', 'ABGELEHNT', 'ABGELAUFEN');

-- CreateTable
CREATE TABLE "Tagesmutter" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "vorname" TEXT NOT NULL,
    "nachname" TEXT NOT NULL,
    "einrichtungsname" TEXT NOT NULL,
    "fotoUrl" TEXT NOT NULL,
    "einrichtungsfotoUrls" TEXT[],
    "strasse" TEXT NOT NULL,
    "plz" TEXT NOT NULL,
    "stadtteil" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "telefon" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "websiteUrl" TEXT,
    "anmeldungUrl" TEXT,
    "oeffnungszeiten" TEXT NOT NULL,
    "ersatzbetreuung" TEXT NOT NULL,
    "verpflegung" "Verpflegung" NOT NULL,
    "beratungsgebiet" "Beratungsgebiet" NOT NULL,
    "schmetterling" BOOLEAN NOT NULL DEFAULT false,
    "schmetterlingPartner" TEXT,
    "mitgliedsnummer" TEXT,
    "mitgliedSeit" TIMESTAMP(3),
    "emailToken" TEXT NOT NULL,
    "lastConfirmed" TIMESTAMP(3),
    "istAktiv" BOOLEAN NOT NULL DEFAULT true,
    "reihenfolge" INTEGER NOT NULL DEFAULT 0,
    "erstelltAm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aktualisiertAm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tagesmutter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FreiePlaetze" (
    "id" TEXT NOT NULL,
    "tagesmutterId" TEXT NOT NULL,
    "platz1Ab" TIMESTAMP(3),
    "platz2Ab" TIMESTAMP(3),
    "platz3Ab" TIMESTAMP(3),
    "platz4Ab" TIMESTAMP(3),
    "platz5Ab" TIMESTAMP(3),
    "aktualisiertAm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FreiePlaetze_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titel" TEXT NOT NULL,
    "kurztext" TEXT NOT NULL,
    "inhaltMd" TEXT NOT NULL,
    "titelbildUrl" TEXT,
    "veroeffentlichtAm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "istEntwurf" BOOLEAN NOT NULL DEFAULT false,
    "aktualisiertAm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Banner" (
    "id" TEXT NOT NULL,
    "bezeichnung" TEXT NOT NULL,
    "notizen" TEXT,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Buchung" (
    "id" TEXT NOT NULL,
    "bannerId" TEXT NOT NULL,
    "tagesmutterId" TEXT NOT NULL,
    "status" "BuchungsStatus" NOT NULL DEFAULT 'ANFRAGE',
    "zeitraumStart" TIMESTAMP(3) NOT NULL,
    "zeitraumEnde" TIMESTAMP(3) NOT NULL,
    "notizenAdmin" TEXT,
    "erstelltAm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aktualisiertAm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Buchung_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tagesmutter_slug_key" ON "Tagesmutter"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tagesmutter_email_key" ON "Tagesmutter"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Tagesmutter_emailToken_key" ON "Tagesmutter"("emailToken");

-- CreateIndex
CREATE UNIQUE INDEX "FreiePlaetze_tagesmutterId_key" ON "FreiePlaetze"("tagesmutterId");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE INDEX "Buchung_bannerId_zeitraumStart_zeitraumEnde_idx" ON "Buchung"("bannerId", "zeitraumStart", "zeitraumEnde");

-- AddForeignKey
ALTER TABLE "FreiePlaetze" ADD CONSTRAINT "FreiePlaetze_tagesmutterId_fkey" FOREIGN KEY ("tagesmutterId") REFERENCES "Tagesmutter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Buchung" ADD CONSTRAINT "Buchung_bannerId_fkey" FOREIGN KEY ("bannerId") REFERENCES "Banner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Buchung" ADD CONSTRAINT "Buchung_tagesmutterId_fkey" FOREIGN KEY ("tagesmutterId") REFERENCES "Tagesmutter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
