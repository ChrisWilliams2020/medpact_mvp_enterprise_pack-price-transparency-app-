-- Migration: add practice_id columns to import_jobs and claim_lines
ALTER TABLE IF EXISTS import_jobs ADD COLUMN IF NOT EXISTS practice_id varchar(128);
ALTER TABLE IF EXISTS claim_lines ADD COLUMN IF NOT EXISTS practice_id varchar(128);
