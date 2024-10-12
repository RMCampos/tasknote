CREATE TABLE IF NOT EXISTS tasknote.user_pwd_limits (
  id SERIAL,
  user_id INTEGER NOT NULL,
  when_happened TIMESTAMP NOT NULL,
  CONSTRAINT user_pwd_limits_pk PRIMARY KEY (id),
  CONSTRAINT user_pwd_limits_user_id_fk FOREIGN KEY (user_id) REFERENCES tasknote.users (id)
);
