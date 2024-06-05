/*
  Warnings:

  - Added the required column `salerStatus` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "salerStatus" VARCHAR(255) NOT NULL;
