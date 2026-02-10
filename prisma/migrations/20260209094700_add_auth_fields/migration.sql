-- AlterTable
ALTER TABLE "USER" ADD COLUMN     "email" VARCHAR(255),
ADD COLUMN     "name" VARCHAR(100),
ADD COLUMN     "password" VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "USER_email_key" ON "USER"("email");
