ALTER TABLE visitor_entry ADD COLUMN is_android_visitor BIT NULL;

ALTER TABLE visitor_entry ADD COLUMN is_meeting_close BIT NULL;

ALTER TABLE visitor_entry ADD COLUMN rescheduled_date_time DATETIME NULL;

ALTER TABLE visitor_entry
ADD COLUMN previous_Valid_From datetime(6) DEFAULT NULL;

ALTER TABLE visitor_entry
ADD COLUMN previous_Valid_To datetime(6) DEFAULT NULL;

ALTER TABLE visitor_entry
ADD COLUMN Is_Visit_Ended BOOLEAN DEFAULT FALSE;

ALTER TABLE visitor_entry
ADD COLUMN Visit_End_Time datetime(6) DEFAULT NULL;
