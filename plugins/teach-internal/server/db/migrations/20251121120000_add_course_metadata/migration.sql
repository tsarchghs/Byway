-- Teach-internal: add metadata column to Course for storing JSON blobs (files, settings)
ALTER TABLE "Course" ADD COLUMN "metadata" TEXT;

