ALTER TABLE tasknote.users ADD COLUMN last_password_change TIMESTAMP WITHOUT TIME ZONE;

-- Initialize for existing users
UPDATE tasknote.users SET last_password_change = created_at WHERE last_password_change IS NULL;

ALTER TABLE tasknote.users ALTER COLUMN last_password_change SET NOT NULL;
