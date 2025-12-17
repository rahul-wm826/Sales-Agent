/*
  Warnings:

  - The `status` column on the `ApolloPerson` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Email` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `direction` to the `Email` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PersonStatus" AS ENUM ('prospect', 'emailQueued', 'emailSent', 'followupScheduled', 'awaitingReply', 'replied', 'qualified', 'notInterested', 'noReply', 'dealWon', 'dealLost', 'unsubscribed');

-- CreateEnum
CREATE TYPE "EmailDirection" AS ENUM ('outbound', 'inbound');

-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('draft', 'sent', 'failed');

-- AlterTable
ALTER TABLE "ApolloPerson" DROP COLUMN "status",
ADD COLUMN     "status" "PersonStatus" NOT NULL DEFAULT 'prospect';

-- AlterTable
ALTER TABLE "Email" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "direction" "EmailDirection" NOT NULL,
ADD COLUMN     "followUpStep" INTEGER,
ADD COLUMN     "receivedAt" TIMESTAMP(3),
ALTER COLUMN "sentAt" DROP NOT NULL,
ALTER COLUMN "sentAt" DROP DEFAULT,
DROP COLUMN "status",
ADD COLUMN     "status" "EmailStatus" NOT NULL DEFAULT 'draft';

-- CreateIndex
CREATE INDEX "ApolloPerson_status_idx" ON "ApolloPerson"("status");
