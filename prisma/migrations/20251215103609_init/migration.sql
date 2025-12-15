-- CreateTable
CREATE TABLE "ApolloPerson" (
    "apolloPersonId" TEXT NOT NULL,
    "email" TEXT,
    "emailEnriched" BOOLEAN NOT NULL DEFAULT false,
    "phoneEnriched" BOOLEAN NOT NULL DEFAULT false,
    "lastEnrichedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApolloPerson_pkey" PRIMARY KEY ("apolloPersonId")
);
