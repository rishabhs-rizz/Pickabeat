/*
  Warnings:

  - A unique constraint covering the columns `[streamId,userId]` on the table `Upvote` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Upvote_streamId_userId_key" ON "public"."Upvote"("streamId", "userId");
