/*
  Warnings:

  - The values [followupScheduled] on the enum `PersonStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PersonStatus_new" AS ENUM ('prospect', 'emailQueued', 'emailSent', 'followUpSent', 'awaitingReply', 'replied', 'qualified', 'notInterested', 'noReply', 'dealWon', 'dealLost', 'unsubscribed');
ALTER TABLE "public"."ApolloPerson" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ApolloPerson" ALTER COLUMN "status" TYPE "PersonStatus_new" USING ("status"::text::"PersonStatus_new");
ALTER TYPE "PersonStatus" RENAME TO "PersonStatus_old";
ALTER TYPE "PersonStatus_new" RENAME TO "PersonStatus";
DROP TYPE "public"."PersonStatus_old";
ALTER TABLE "ApolloPerson" ALTER COLUMN "status" SET DEFAULT 'prospect';
COMMIT;
