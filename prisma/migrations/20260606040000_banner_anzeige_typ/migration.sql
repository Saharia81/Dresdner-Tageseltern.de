-- CreateEnum
CREATE TYPE "BannerInhaltTyp" AS ENUM ('STECKBRIEF', 'INDIVIDUELL');

-- AlterTable
ALTER TABLE "Buchung" ADD COLUMN "anzeigeTyp" "BannerInhaltTyp" NOT NULL DEFAULT 'STECKBRIEF';
ALTER TABLE "Buchung" ADD COLUMN "wunsch" TEXT;
ALTER TABLE "Buchung" ADD COLUMN "inhaltTitel" TEXT;
ALTER TABLE "Buchung" ADD COLUMN "inhaltText" TEXT;
ALTER TABLE "Buchung" ADD COLUMN "inhaltBildUrl" TEXT;
ALTER TABLE "Buchung" ADD COLUMN "inhaltLinkUrl" TEXT;
ALTER TABLE "Buchung" ADD COLUMN "inhaltLinkText" TEXT;
