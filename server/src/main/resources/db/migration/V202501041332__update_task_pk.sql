alter table tasknote.task_url
  drop constraint task_url_pk;

alter table tasknote.task_url
  drop column id;

alter table tasknote.task_url
  add constraint task_url_pk primary key (task_id, url);
