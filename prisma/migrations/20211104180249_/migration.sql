-- AlterTable
ALTER TABLE "User" ADD COLUMN     "authorized_notifications" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notification_token" TEXT;
