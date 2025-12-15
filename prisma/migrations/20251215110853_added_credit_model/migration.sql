-- CreateTable
CREATE TABLE "ApolloCreditEvent" (
    "id" TEXT NOT NULL,
    "apolloPersonId" TEXT NOT NULL,
    "creditType" TEXT NOT NULL DEFAULT 'email',
    "creditsUsed" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApolloCreditEvent_pkey" PRIMARY KEY ("id")
);
