-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);
