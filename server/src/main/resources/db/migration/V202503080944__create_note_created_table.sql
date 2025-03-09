CREATE TABLE IF NOT EXISTS tasknote.notes_created (
  user_id    INTEGER NOT NULL,
  count      INTEGER NOT NULL,
  CONSTRAINT notes_created_pk PRIMARY KEY (user_id),
  CONSTRAINT notes_created_user_id_fk FOREIGN KEY (user_id) REFERENCES tasknote.users (id)
);
