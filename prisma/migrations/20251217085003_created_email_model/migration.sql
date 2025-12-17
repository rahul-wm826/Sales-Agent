/*
  Warnings:

  - You are about to drop the column `emailHtml` on the `ApolloPerson` table. All the data in the column will be lost.
  - You are about to drop the column `emailSubject` on the `ApolloPerson` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ApolloPerson" DROP COLUMN "emailHtml",
DROP COLUMN "emailSubject";

-- CreateTable
CREATE TABLE "Email" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "htmlContent" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Email_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Email_personId_idx" ON "Email"("personId");

-- CreateIndex
CREATE INDEX "ApolloPerson_email_idx" ON "ApolloPerson"("email");

-- CreateIndex
CREATE INDEX "ApolloPerson_status_idx" ON "ApolloPerson"("status");

-- AddForeignKey
ALTER TABLE "Email" ADD CONSTRAINT "Email_personId_fkey" FOREIGN KEY ("personId") REFERENCES "ApolloPerson"("apolloPersonId") ON DELETE CASCADE ON UPDATE CASCADE;
