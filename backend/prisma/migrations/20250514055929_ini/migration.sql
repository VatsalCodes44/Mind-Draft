/*
  Warnings:

  - Added the required column `editorState` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `summary` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "editorState" TEXT NOT NULL,
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "summary" TEXT NOT NULL,
ALTER COLUMN "published" DROP DEFAULT,
ALTER COLUMN "date" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Comments" (
    "id" SERIAL NOT NULL,
    "blogId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "comment" TEXT NOT NULL,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("id")
);
