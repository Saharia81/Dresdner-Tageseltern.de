-- DropForeignKey
ALTER TABLE "Buchung" DROP CONSTRAINT "Buchung_tagesmutterId_fkey";

-- AlterTable
ALTER TABLE "Banner" ADD COLUMN     "beschreibung" TEXT NOT NULL,
ADD COLUMN     "fotoUrl" TEXT NOT NULL,
ADD COLUMN     "groesse" TEXT NOT NULL,
ADD COLUMN     "istAktiv" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "nummer" INTEGER NOT NULL,
ADD COLUMN     "reihenfolge" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Buchung" ADD COLUMN     "erinnerung5TageGesendet" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "grundstueckBestaetigt" BOOLEAN NOT NULL,
ADD COLUMN     "info3TageGesendet" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "kontaktEmail" TEXT NOT NULL,
ADD COLUMN     "kontaktName" TEXT NOT NULL,
ADD COLUMN     "token" TEXT NOT NULL,
ALTER COLUMN "tagesmutterId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Banner_nummer_key" ON "Banner"("nummer");

-- CreateIndex
CREATE UNIQUE INDEX "Buchung_token_key" ON "Buchung"("token");

-- AddForeignKey
ALTER TABLE "Buchung" ADD CONSTRAINT "Buchung_tagesmutterId_fkey" FOREIGN KEY ("tagesmutterId") REFERENCES "Tagesmutter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

