CREATE TABLE IF NOT EXISTS tasknote.tasks (
  id SERIAL,
  user_id INTEGER NOT NULL,
  description VARCHAR(300) NOT NULL,
  done BOOLEAN NOT NULL,
  CONSTRAINT task_pk PRIMARY KEY (id),
  CONSTRAINT task_user_id_fk FOREIGN KEY (user_id) REFERENCES tasknote.users (id)
);

CREATE TABLE IF NOT EXISTS tasknote.task_url (
  id SERIAL,
  task_id INTEGER NOT NULL,
  url VARCHAR(200) NOT NULL,
  CONSTRAINT task_url_pk PRIMARY KEY (id),
  CONSTRAINT task_url_task_id_fk FOREIGN KEY (task_id) REFERENCES tasknote.tasks (id)
);
