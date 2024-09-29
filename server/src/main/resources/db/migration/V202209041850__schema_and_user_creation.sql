CREATE SCHEMA IF NOT EXISTS tasknote;

CREATE TABLE IF NOT EXISTS tasknote.users (
  id SERIAL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  admin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL,
  inactivated_at TIMESTAMP,
  CONSTRAINT users_pk PRIMARY KEY (id),
  CONSTRAINT users_email_uk UNIQUE (email)
);
