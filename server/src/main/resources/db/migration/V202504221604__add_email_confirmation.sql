ALTER TABLE tasknote.users
  ADD email_confirmed_at TIMESTAMP null,
  ADD email_uuid UUID UNIQUE NULL,
  ADD reset_password_expiration TIMESTAMP NULL,
  ADD reset_token VARCHAR(35) NULL;
