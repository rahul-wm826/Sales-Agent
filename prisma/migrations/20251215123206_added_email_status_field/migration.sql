/*
  Warnings:

  - Added the required column `emailStatus` to the `ApolloPerson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ApolloPerson" ADD COLUMN     "emailStatus" TEXT NOT NULL;
