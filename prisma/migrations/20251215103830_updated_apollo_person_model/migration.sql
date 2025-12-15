/*
  Warnings:

  - You are about to drop the column `createdAt` on the `ApolloPerson` table. All the data in the column will be lost.
  - You are about to drop the column `lastEnrichedAt` on the `ApolloPerson` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ApolloPerson" DROP COLUMN "createdAt",
DROP COLUMN "lastEnrichedAt",
ADD COLUMN     "enrichedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
