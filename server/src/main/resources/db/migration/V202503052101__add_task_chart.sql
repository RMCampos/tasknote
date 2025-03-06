CREATE TABLE IF NOT EXISTS tasknote.user_tasks_done (
  user_id INTEGER NOT NULL,
  task_id INTEGER NOT NULL,
  done_date TIMESTAMP NOT NULL,
  CONSTRAINT user_tasks_done_pk PRIMARY KEY (user_id, task_id),
  CONSTRAINT user_tasks_done_user_id_fk FOREIGN KEY (user_id) REFERENCES tasknote.users (id),
  CONSTRAINT user_tasks_done_task_id_fk FOREIGN KEY (task_id) REFERENCES tasknote.tasks (id)
);
