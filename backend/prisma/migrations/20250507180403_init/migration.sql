/*
  Warnings:

  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;

-- CreateTable
CREATE TABLE "Followers" (
    "userId" TEXT NOT NULL,
    "Follower" TEXT NOT NULL,

    CONSTRAINT "Followers_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Following" (
    "userId" TEXT NOT NULL,
    "Following" TEXT NOT NULL,

    CONSTRAINT "Following_pkey" PRIMARY KEY ("userId")
);
