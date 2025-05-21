-- AlterTable
ALTER TABLE "Bookmark" ADD COLUMN     "id_user" INTEGER;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
