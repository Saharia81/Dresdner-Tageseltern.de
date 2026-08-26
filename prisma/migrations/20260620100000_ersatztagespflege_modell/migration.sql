-- CreateEnum
CREATE TYPE "Ersatzmodell" AS ENUM ('KEINE', 'BASIS_ETP', 'STUETZPUNKT');

-- AlterTable
ALTER TABLE "Tagesmutter" ADD COLUMN "ersatzmodell" "Ersatzmodell" NOT NULL DEFAULT 'KEINE';
ALTER TABLE "Tagesmutter" ADD COLUMN "ersatzFreierPlatz" BOOLEAN NOT NULL DEFAULT false;
