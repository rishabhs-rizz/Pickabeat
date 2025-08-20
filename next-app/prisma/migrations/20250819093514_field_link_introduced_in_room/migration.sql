/*
  Warnings:

  - A unique constraint covering the columns `[link]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `link` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Room" ADD COLUMN     "link" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Room_link_key" ON "public"."Room"("link");
