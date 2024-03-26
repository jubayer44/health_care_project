/*
  Warnings:

  - You are about to drop the column `avarageRating` on the `doctors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "avarageRating",
ADD COLUMN     "averageRating" DOUBLE PRECISION;
