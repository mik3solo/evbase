-- CreateTable
CREATE TABLE "EV" (
    "id" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "epa_range" INTEGER NOT NULL,
    "battery_kwh" DOUBLE PRECISION NOT NULL,
    "acceleration" DOUBLE PRECISION NOT NULL,
    "tax_credit" BOOLEAN NOT NULL,
    "msrp" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EV_pkey" PRIMARY KEY ("id")
);
