/*
  Warnings:

  - Made the column `email` on table `ApolloPerson` required. This step will fail if there are existing NULL values in that column.
  - Made the column `firstName` on table `ApolloPerson` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ApolloPerson" ADD COLUMN     "details" JSONB,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "firstName" SET NOT NULL;
