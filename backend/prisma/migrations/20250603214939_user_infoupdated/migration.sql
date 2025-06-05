/*
  Warnings:

  - You are about to drop the column `profileExist` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "profileExist",
ADD COLUMN     "profilePicExist" BOOLEAN;
