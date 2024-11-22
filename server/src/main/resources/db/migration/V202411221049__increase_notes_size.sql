-- Increase varchar column to TEXT up to 2000 characters
ALTER TABLE tasknote.notes
ALTER COLUMN description TYPE TEXT;

-- Add a comment explaining the change
COMMENT ON COLUMN tasknote.notes.description IS 'Column increased to allow TEXT up to 2000 characters';

-- Optionally add a CHECK constraint to enforce a maximum length limit
ALTER TABLE tasknote.notes
ADD CONSTRAINT chk_max_length CHECK (length(description) <= 2000);
