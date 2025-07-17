ALTER TABLE user_session ADD COLUMN android_user TINYINT(1) NOT NULL DEFAULT 0;
ALTER TABLE user_session ADD COLUMN ios_user TINYINT(1) NOT NULL DEFAULT 0;
ALTER TABLE user_session ADD COLUMN mobileno varchar(15);