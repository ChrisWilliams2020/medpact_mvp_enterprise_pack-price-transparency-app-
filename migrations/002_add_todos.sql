-- Add todos table
ALTER TABLE IF NOT EXISTS todos
ADD COLUMN IF NOT EXISTS id serial PRIMARY KEY;

CREATE TABLE IF NOT EXISTS todos (
  id serial PRIMARY KEY,
  text text NOT NULL,
  done boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);
