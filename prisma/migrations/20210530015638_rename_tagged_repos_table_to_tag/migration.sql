/*
  Warnings:

  - You are about to drop the `tagged_repositories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "tagged_repositories";

-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "repo_id" INTEGER NOT NULL,
    "tag_name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);
