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

ALTER TABLE visitor_entry
ADD COLUMN previous_Valid_From datetime(6) DEFAULT NULL;

Alter table approval_configuration
add column `Is_Department_Specific` bool null;

alter table approval_configuration_details
add column `Department_Id` bigint null;

Alter table plant
add column `Is_Doc_Mandatory` bool null,
add column `Is_File_Mandatory` bool null; 


alter table approval_configuration_details change column Role_Id Role_Id bigint null;