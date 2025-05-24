DROP TABLE IF EXISTS tasknote.notes_created;
DROP TABLE IF EXISTS tasknote.user_tasks_done;

ALTER TABLE tasknote.notes
  ADD last_update timestamp;
