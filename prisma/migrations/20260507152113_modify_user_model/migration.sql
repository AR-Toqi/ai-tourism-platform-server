/*
  Warnings:

  - The `role` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('USER', 'ADMIN', 'CONTENT_MANAGER');

-- CreateEnum
CREATE TYPE "User_Status" AS ENUM ('ACTIVE', 'BLOCKED');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "User_Status" NOT NULL DEFAULT 'ACTIVE',
DROP COLUMN "role",
ADD COLUMN     "role" "user_role" NOT NULL DEFAULT 'USER';

-- DropEnum
DROP TYPE "Role";
