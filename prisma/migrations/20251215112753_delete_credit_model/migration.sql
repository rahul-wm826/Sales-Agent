/*
  Warnings:

  - You are about to drop the column `emailEnriched` on the `ApolloPerson` table. All the data in the column will be lost.
  - You are about to drop the column `phoneEnriched` on the `ApolloPerson` table. All the data in the column will be lost.
  - You are about to drop the `ApolloCreditEvent` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "ApolloPerson" DROP COLUMN "emailEnriched",
DROP COLUMN "phoneEnriched";

-- DropTable
DROP TABLE "ApolloCreditEvent";
