ALTER TABLE tasknote.user_tasks_done
  DROP CONSTRAINT user_tasks_done_task_id_fk;

ALTER TABLE tasknote.notes
  ALTER COLUMN description TYPE TEXT;

ALTER TABLE tasknote.notes
  DROP CONSTRAINT chk_max_length;
