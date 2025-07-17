ALTER TABLE visitor_entry
ADD COLUMN previous_Valid_From datetime(6) DEFAULT NULL;

ALTER TABLE visitor_entry
ADD COLUMN previous_Valid_To datetime(6) DEFAULT NULL;

ALTER TABLE visitor_entry
ADD COLUMN Visit_End_Time datetime(6) DEFAULT NULL;


ALTER TABLE plant 
Add COLUMN Is_Notification BOOLEAN NULL,
Add COLUMN Alter_After_Mins Decimal(5,2) NUll;

ALTER TABLE Visitor_Detail
Add COLUMN Aadhar_No BIGINT DEFAULT NULL;

ALTER TABLE Visitor_Entry_Detail
Add COLUMN Aadhar_No BIGINT DEFAULT NULL;