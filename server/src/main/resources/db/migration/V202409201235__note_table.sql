CREATE TABLE IF NOT EXISTS tasknote.notes (
  id SERIAL,
  user_id INTEGER NOT NULL,
  description VARCHAR(300) NOT NULL,
  CONSTRAINT notes_pk PRIMARY KEY (id),
  CONSTRAINT notes_user_id_fk FOREIGN KEY (user_id) REFERENCES tasknote.users (id)
);

CREATE TABLE IF NOT EXISTS tasknote.note_urls (
  id SERIAL,
  note_id INTEGER NOT NULL,
  url VARCHAR(200) NOT NULL,
  CONSTRAINT note_url_pk PRIMARY KEY (id),
  CONSTRAINT note_url_note_id_fk FOREIGN KEY (note_id) REFERENCES tasknote.notes (id)
);
