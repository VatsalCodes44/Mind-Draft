/*
  Warnings:

  - Added the required column `imageExist` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "imageExist" BOOLEAN NOT NULL;
