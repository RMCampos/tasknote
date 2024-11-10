alter table tasknote.tasks
  add status varchar(1),  -- P|ENDING, S|TARTED, D|ONE
  add due_date date,
  add due_date_notify boolean,
  add due_date_notify_sent boolean,
  add high_priority boolean;
