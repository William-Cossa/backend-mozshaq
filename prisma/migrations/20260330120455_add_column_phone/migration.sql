/*
  Warnings:

  - You are about to drop the column `linkedin` on the `instructors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "instructors" DROP COLUMN "linkedin",
ADD COLUMN     "phone" TEXT;
