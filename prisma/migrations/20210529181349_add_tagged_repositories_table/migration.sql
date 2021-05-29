-- CreateTable
CREATE TABLE "tagged_repositories" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "repo_id" INTEGER NOT NULL,
    "tag_name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);
