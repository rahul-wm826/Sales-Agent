/*
  Warnings:

  - Added the required column `status` to the `ApolloPerson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ApolloPerson" ADD COLUMN     "lastMailedAt" TIMESTAMP(3),
ADD COLUMN     "mailCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" TEXT NOT NULL;
