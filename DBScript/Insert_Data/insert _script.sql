--       Compnay
INSERT INTO Company(
 Company_Id,
 Company_Code,
 Company_Name,
 Country_Id,
 State_Id,
 city_Id,
 Status,
 Created_By,
 Created_On,
 Modified_By,
 Modified_On
 )
 VALUES(
 1,
 'CMP00001',
 'SSMPL',
 1,
 1,
 1,
 1,
 1,
 NOW(),
 null,
 null
 );


-- update Company set Host = "webmail.smartvms.in";
-- update Company set Port = "587";
-- update Company set Mail = "info@smartvms.in";
-- update Company set User_Name = "info@smartvms.in";
-- update Company set Password = "89S22fp_u";



 
 --       INSERTING INTO COUNTRY

  INSERT INTO Country(
  Country_Id,
  Country_Name,
  Country_Code,
  Country_Short_Form,
  Nationality,
  Status,
  Created_By,
  Created_On,
  Modified_By,
  Modified_On
  )
  VALUES(
  1,
  'INDIA',
  'CNT00001',
  'IND',
  'Indian',
  1,
  1,
  NOW(),
  null,
  null
  );

  --       INSERTING INTO STATE

  INSERT INTO State(
  State_Id,
  Country_Id,
  State_Name,
  State_Code,
  Status,
  Created_By,
  Created_On,
  Modified_By,
  Modified_On
  )
  VALUES(
  1,
  1,
  'Tamil Nadu',
  'STE00001',
  1,
  1,
  NOW(),
  null,
  null
  );

  --       INSERTING INTO CITY

  INSERT INTO City(
  City_Id,
  Country_Id,
  State_Id,
  City_Name,
  City_Code,
  Company_Id,
  Plant_Id,
  Status,
  Created_By,
  Created_On,
  Modified_By,
  Modified_On
  )
  VALUES
  (
  1,
  1,
  1,
  'Chennai',
  'CTY00001',
  1,
  1,
  1,
  1,
  NOW(),
  null,
  null
  );

-- Gate
INSERT INTO Gate (
Gate_Name,
Gate_Code,
Gate_No,
Gate_Incharge_id,
Gate_Open_Time,
Gate_Close_Time,
Company_Id,
Plant_Id,
Status,
Created_By,
Created_On,
Modified_By,
Modified_On
)
values
(
    "Main Gate",
    "GAT0001",
    1,
    1,
    now(),
    now(),
    1,
    1,
    1,
    1,
    now(),
    1,
    now()
);
 
 --       Area
 INSERT INTO `area`
(`Status`,
`Plant_Id`,
`Modified_On`,
`Modified_By`,
`Created_By`,
`Created_On`,
`Company_Id`,
`Area_Name`,
`Area_Id`,
`Area_Code`)
VALUES
(1,
1,
NOW(),
1,
1,
NOW(),
1,
'Sample',
1,
'ARE00001');

 
 --       User Roles
 
 INSERT INTO Role(
  Role_Code,
  Role_Name,
  Company_Id,
  Plant_Id,
  Status,
  Created_By,
  Created_On,
  Modified_By,
  Modified_On,
  Is_Designation
  )
  VALUES(
  'ROL0001',
  'Super Admin',
  1,
  1,
  1,
  1,
  NOW(),
  null,
  null,
  0
  ),
  (
  'ROL00002',
  'Admin',
  1,
  1,
  1,
  1,
  NOW(),
  null,
  null,
  0
  ),
  (
  'ROL00003',
  'Manager',
  1,
  1,
  1,
  1,
  NOW(),
  null,
  null,
  0
  ),
  (
  'ROL00004',
  'Supervisor',
  1,
  1,
  1,
  1,
  NOW(),
  null,
  null,
  0
  ),
  (
  'ROL00005',
  'Security',
  1,
  1,
  1,
  1,
  NOW(),
  null,
  null,
  0
  );
  
 
--      User Gate 

 INSERT INTO Gate(
 Gate_Name,
 Gate_Code,
 Gate_No,
 Gate_Incharge_id,
 Gate_Open_Time,
 Gate_Close_Time,
 Company_Id,
 Plant_Id,
 Status,
 Created_By,
 Created_On,
 Modified_By,
 Modified_On
 )
 VALUES
 (
 'Main Gate',
 'GAT00001',
 'G1',
 5,
 NOW(),
NOW(),
 1,
 1,
 1,
 1,
 NOW(),
 null,
 null
 );

--      plant
INSERT INTO Plant(
 Plant_Code,
 Plant_Name,
 Plant_Type,
 Address,
 Geo_Location,
 Country_Id,
 city_Id,
 State_Id,
 Company_Id,
 Status,
 Created_By,
 Created_On,
 Modified_By,
 Modified_On
 )
 VALUES(
 'PLT00001',
 'IT Sector',
 98,
 'NESAPAKKAM CHENNAI',
 '45345463423',
 1,
 1,
 1,
 1,
 1,
 1,
 NOW(),
 null,
 null
 );

--      Users
INSERT INTO Users 
(
    User_Name,
    Password,
    Company_Id,
    Plant_Id,
    User_Code,
    Gate_Id,
    Default_Role_Id,
    User_Email,
    User_Tel_No,
    Secondary_Mobile_No,
    Address,
    Dept_Id,
    Status,
    Created_By,
    Created_On,
    Modified_By,
    Modified_On,
    is_blocked,
    user_image_name,
    user_image_url
)
VALUES 
(
    'Super Admin',
    'Visit@123',
    1,
    1,
    'USR00001',
    1,
    1,
    'superadmin@gmail.com',
    '999999999',
    '999999999',
    'Pothigai Foundation, Pillayar Kovil Street, Nesappakkam, Chennai – 600 078.',
    1,
    1,
    1,
    NOW(),
    NULL,
    NULL,
    0,
    NULL,
    NULL
);

--      User Plant Map
 INSERT INTO User_Plant_Map(
 Company_Id,
 User_Id,
 Plant_Id,
 Status,
 Accounting_Year,
 Is_Default
 )
 VALUES(
 1,
 1,
 1,
 1,
 2023,
 1
 );

--      User Gate Map
 INSERT INTO User_Gate_Map(
 Company_Id,
 User_Id,
 Plant_Id,
 Gate_Id,
 Status,
 Accounting_Year,
 Is_Default
 )
 VALUES(
 1,
 1,
 1,
 1,
 1,
 2023,
 1
 );

--      User Role Map
INSERT INTO User_Role_Map (
    Company_Id,
    User_Id,
    Role_Id,
    Status,
    Accounting_Year,
    Is_Default
)
VALUES (
        1,
    1,
    1,
    1,
    2024,
    1
);

--      User Company Map
 INSERT INTO User_Company_Map(
 Company_Id,
 User_Id,
 Status,
 Accounting_Year,
 Is_Default
 )
 VALUES(
 1,
 1,
 1,
 2023,
 1
 );
 
  --      User Screen Mapping

 INSERT INTO User_Screen_Mapping(
 User_Id,
 Role_Id,
 Company_Id,
 Module_Id,
 Screen_Id,
 `Create`,
 `Update`,
 `Delete`,
 `View`,
 `Print`,
 `Approval`,
 Status,
 Created_By,
 Created_On,
 Modified_By,
 Modified_On
 )
 VALUES
 (1,1,1,1,4,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (1,1,1,1,5,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (1,1,1,1,6,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (1,1,1,1,7,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (1,1,1,1,8,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (1,1,1,1,9,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (1,1,1,1,10,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (1,1,1,1,11,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (1,1,1,1,12,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (1,1,1,1,13,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (1,1,1,1,14,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (1,1,1,1,15,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (1,1,1,1,16,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (1,1,1,1,17,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (1,1,1,1,18,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (1,1,1,1,19,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (1,1,1,1,20,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (1,1,1,1,21,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (1,1,1,1,22,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (1,1,1,1,23,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (1,1,1,1,24,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (1,1,1,1,25,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (1,1,1,1,26,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (1,1,1,1,27,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (1,1,1,1,28,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (1,1,1,1,29,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (1,1,1,1,32,1,1,1,1,1,1,1,1,NOW(),1,NOW());

 INSERT INTO User_Screen_Mapping(
 User_Id,
 Role_Id,
 Company_Id,
 Module_Id,
 Screen_Id,
 `Create`,
 `Update`,
 `Delete`,
 `View`,
 `Print`,
 `Approval`,
 Status,
 Created_By,
 Created_On,
 Modified_By,
 Modified_On
 )
 VALUES
 (2,2,1,1,4,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (2,2,1,1,5,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (2,2,1,1,6,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (2,2,1,1,7,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (2,2,1,1,8,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (2,2,1,1,9,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (2,2,1,1,10,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (2,2,1,1,11,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (2,2,1,1,12,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (2,2,1,1,13,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (2,2,1,1,14,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (2,2,1,1,15,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (2,2,1,1,16,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (2,2,1,1,17,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (2,2,1,1,18,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (2,2,1,1,19,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (2,2,1,1,20,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (2,2,1,1,21,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (2,2,1,1,22,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (2,2,1,1,23,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (2,2,1,1,24,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (2,2,1,1,25,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (2,2,1,1,26,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (2,2,1,1,27,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (2,2,1,1,28,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (2,2,1,1,29,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (2,2,1,1,32,1,1,1,1,1,1,1,1,NOW(),1,NOW());

 INSERT INTO User_Screen_Mapping(
 User_Id,
 Role_Id,
 Company_Id,
 Module_Id,
 Screen_Id,
 `Create`,
 `Update`,
 `Delete`,
 `View`,
 `Print`,
 `Approval`,
 Status,
 Created_By,
 Created_On,
 Modified_By,
 Modified_On
 )
 VALUES
 (5,5,1,1,4,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (5,5,1,1,5,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (5,5,1,1,6,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (5,5,1,1,7,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (5,5,1,1,8,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (5,5,1,1,9,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (5,5,1,1,10,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (5,5,1,1,11,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (5,5,1,1,12,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (5,5,1,1,13,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (5,5,1,1,14,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (5,5,1,1,15,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (5,5,1,1,16,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (5,5,1,1,17,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (5,5,1,1,18,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (5,5,1,1,19,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (5,5,1,1,20,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (5,5,1,1,21,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (5,5,1,1,22,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (5,5,1,1,23,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (5,5,1,1,24,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (5,5,1,1,25,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (5,5,1,1,26,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (5,5,1,1,27,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (5,5,1,1,28,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (5,5,1,1,29,1,1,1,1,1,1,1,1,NOW(),1,NOW()),
 (5,5,1,1,32,1,1,1,1,1,1,1,1,NOW(),1,NOW());

--      Function Role Map

INSERT INTO Function_Role_Map (
    Role_Id,
    Function_Id,
    Company_Id,
    Plant_Id,
    Status,
    Created_By,
    Created_On,
    Modified_By,
    Modified_On
)
VALUES
(1,4,1,1,1,1,NOW(),1,NOW()),
(1,5,1,1,1,1,NOW(),1,NOW()),
(1,6,1,1,1,1,NOW(),1,NOW()),
(1,7,1,1,1,1,NOW(),1,NOW()),
(1,8,1,1,1,1,NOW(),1,NOW()),
(1,9,1,1,1,1,NOW(),1,NOW()),
(1,10,1,1,1,1,NOW(),1,NOW()),
(1,11,1,1,1,1,NOW(),1,NOW()),
(1,12,1,1,1,1,NOW(),1,NOW()),
(1,13,1,1,1,1,NOW(),1,NOW()),
(1,14,1,1,1,1,NOW(),1,NOW()),
(1,15,1,1,1,1,NOW(),1,NOW()),
(1,16,1,1,1,1,NOW(),1,NOW()),
(1,17,1,1,1,1,NOW(),1,NOW()),
(1,18,1,1,1,1,NOW(),1,NOW()),
(1,19,1,1,1,1,NOW(),1,NOW()),
(1,20,1,1,1,1,NOW(),1,NOW()),
(1,21,1,1,1,1,NOW(),1,NOW()),
(1,22,1,1,1,1,NOW(),1,NOW()),
(1,23,1,1,1,1,NOW(),1,NOW()),
(1,24,1,1,1,1,NOW(),1,NOW()),
(1,25,1,1,1,1,NOW(),1,NOW()),
(1,26,1,1,1,1,NOW(),1,NOW()),
(1,27,1,1,1,1,NOW(),1,NOW()),
(1,32,1,1,1,1,NOW(),1,NOW());

INSERT INTO Function_Role_Map (
    Role_Id,
    Function_Id,
    Company_Id,
    Plant_Id,
    Status,
    Created_By,
    Created_On,
    Modified_By,
    Modified_On
)
VALUES
(2,4,1,1,1,1,NOW(),1,NOW()),
(2,5,1,1,1,1,NOW(),1,NOW()),
(2,6,1,1,1,1,NOW(),1,NOW()),
(2,7,1,1,1,1,NOW(),1,NOW()),
(2,8,1,1,1,1,NOW(),1,NOW()),
(2,9,1,1,1,1,NOW(),1,NOW()),
(2,10,1,1,1,1,NOW(),1,NOW()),
(2,11,1,1,1,1,NOW(),1,NOW()),
(2,12,1,1,1,1,NOW(),1,NOW()),
(2,13,1,1,1,1,NOW(),1,NOW()),
(2,14,1,1,1,1,NOW(),1,NOW()),
(2,15,1,1,1,1,NOW(),1,NOW()),
(2,16,1,1,1,1,NOW(),1,NOW()),
(2,17,1,1,1,1,NOW(),1,NOW()),
(2,18,1,1,1,1,NOW(),1,NOW()),
(2,19,1,1,1,1,NOW(),1,NOW()),
(2,20,1,1,1,1,NOW(),1,NOW()),
(2,21,1,1,1,1,NOW(),1,NOW()),
(2,22,1,1,1,1,NOW(),1,NOW()),
(2,23,1,1,1,1,NOW(),1,NOW()),
(2,24,1,1,1,1,NOW(),1,NOW()),
(2,25,1,1,1,1,NOW(),1,NOW()),
(2,26,1,1,1,1,NOW(),1,NOW()),
(2,27,1,1,1,1,NOW(),1,NOW()),
(2,32,1,1,1,1,NOW(),1,NOW());

INSERT INTO Function_Role_Map (
    Role_Id,
    Function_Id,
    Company_Id,
    Plant_Id,
    Status,
    Created_By,
    Created_On,
    Modified_By,
    Modified_On
)
VALUES
(5,4,1,1,1,1,NOW(),1,NOW()),
(5,5,1,1,1,1,NOW(),1,NOW()),
(5,6,1,1,1,1,NOW(),1,NOW()),
(5,7,1,1,1,1,NOW(),1,NOW()),
(5,8,1,1,1,1,NOW(),1,NOW()),
(5,9,1,1,1,1,NOW(),1,NOW()),
(5,10,1,1,1,1,NOW(),1,NOW()),
(5,11,1,1,1,1,NOW(),1,NOW()),
(5,12,1,1,1,1,NOW(),1,NOW()),
(5,13,1,1,1,1,NOW(),1,NOW()),
(5,14,1,1,1,1,NOW(),1,NOW()),
(5,15,1,1,1,1,NOW(),1,NOW()),
(5,16,1,1,1,1,NOW(),1,NOW()),
(5,17,1,1,1,1,NOW(),1,NOW()),
(5,18,1,1,1,1,NOW(),1,NOW()),
(5,19,1,1,1,1,NOW(),1,NOW()),
(5,20,1,1,1,1,NOW(),1,NOW()),
(5,21,1,1,1,1,NOW(),1,NOW()),
(5,22,1,1,1,1,NOW(),1,NOW()),
(5,23,1,1,1,1,NOW(),1,NOW()),
(5,24,1,1,1,1,NOW(),1,NOW()),
(5,25,1,1,1,1,NOW(),1,NOW()),
(5,26,1,1,1,1,NOW(),1,NOW()),
(5,27,1,1,1,1,NOW(),1,NOW()),
(5,32,1,1,1,1,NOW(),1,NOW());


-- Numbering Schema


INSERT INTO `Numbering_Schema` (`Numbering_Schema_Id`,`Plant_Id`,`Document_Id`,`Prefix`,`Symbol_Id`,`Suffix`,`Status`,`Created_By`,`Created_On`,`Modified_By`,`Modified_On`,`Sequence_Name`,`W_Sequence_Name`,`Date_Format`,`Table_Name`) VALUES (1,1,26,'VST',101,'',1,1,'2023-09-25 11:37:25.295000',1,'2023-09-25 11:37:25.295000','VISITORSeq','W_VISITORSeq',NULL,'visitor_detail');
INSERT INTO `Numbering_Schema` (`Numbering_Schema_Id`,`Plant_Id`,`Document_Id`,`Prefix`,`Symbol_Id`,`Suffix`,`Status`,`Created_By`,`Created_On`,`Modified_By`,`Modified_On`,`Sequence_Name`,`W_Sequence_Name`,`Date_Format`,`Table_Name`) VALUES (2,1,8,'VSE',101,'',1,1,'2023-09-25 11:37:25.295000',1,'2023-09-25 11:37:25.295000','VISITORENTRYSeq','W_VISITORENTRYSeq',NULL,'visitor_entry');
INSERT INTO `Numbering_Schema` (`Numbering_Schema_Id`,`Plant_Id`,`Document_Id`,`Prefix`,`Symbol_Id`,`Suffix`,`Status`,`Created_By`,`Created_On`,`Modified_By`,`Modified_On`,`Sequence_Name`,`W_Sequence_Name`,`Date_Format`,`Table_Name`) VALUES (3,1,4,'COU',101,'',1,1,'2023-09-25 11:37:25.295000',1,'2023-09-25 11:37:25.295000','COUNTRYSeq','W_COUNTRYSeq',NULL,'country');
INSERT INTO `Numbering_Schema` (`Numbering_Schema_Id`,`Plant_Id`,`Document_Id`,`Prefix`,`Symbol_Id`,`Suffix`,`Status`,`Created_By`,`Created_On`,`Modified_By`,`Modified_On`,`Sequence_Name`,`W_Sequence_Name`,`Date_Format`,`Table_Name`) VALUES (4,1,5,'STE',101,'',1,1,'2023-09-25 11:37:25.295000',1,'2023-09-25 11:37:25.295000','STATESeq','W_STATESeq',NULL,'state');
INSERT INTO `Numbering_Schema` (`Numbering_Schema_Id`,`Plant_Id`,`Document_Id`,`Prefix`,`Symbol_Id`,`Suffix`,`Status`,`Created_By`,`Created_On`,`Modified_By`,`Modified_On`,`Sequence_Name`,`W_Sequence_Name`,`Date_Format`,`Table_Name`) VALUES (5,1,7,'VKL',101,'',1,1,'2023-09-25 11:37:25.295000',1,'2023-09-25 11:37:25.295000','VEHICLESeq','W_VEHICLESeq',NULL,'vehicle');
INSERT INTO `Numbering_Schema` (`Numbering_Schema_Id`,`Plant_Id`,`Document_Id`,`Prefix`,`Symbol_Id`,`Suffix`,`Status`,`Created_By`,`Created_On`,`Modified_By`,`Modified_On`,`Sequence_Name`,`W_Sequence_Name`,`Date_Format`,`Table_Name`) VALUES (6,1,10,'SFT',101,'',1,1,'2023-09-25 11:37:25.295000',1,'2023-09-25 11:37:25.295000','SHIFTSeq','W_SHIFTSeq',NULL,'shift');
INSERT INTO `Numbering_Schema` (`Numbering_Schema_Id`,`Plant_Id`,`Document_Id`,`Prefix`,`Symbol_Id`,`Suffix`,`Status`,`Created_By`,`Created_On`,`Modified_By`,`Modified_On`,`Sequence_Name`,`W_Sequence_Name`,`Date_Format`,`Table_Name`) VALUES (7,1,11,'SPR',101,'',1,1,'2023-09-25 11:37:25.295000',1,'2023-09-25 11:37:25.295000','SUPPLIERSeq','W_SUPPLIERSeq',NULL,'supplier');
INSERT INTO `Numbering_Schema` (`Numbering_Schema_Id`,`Plant_Id`,`Document_Id`,`Prefix`,`Symbol_Id`,`Suffix`,`Status`,`Created_By`,`Created_On`,`Modified_By`,`Modified_On`,`Sequence_Name`,`W_Sequence_Name`,`Date_Format`,`Table_Name`) VALUES (8,1,14,'CNY',101,'',1,1,'2023-09-25 11:37:25.295000',1,'2023-09-25 11:37:25.295000','COMPANYSeq','W_COMPANYSeq',NULL,'company');
INSERT INTO `Numbering_Schema` (`Numbering_Schema_Id`,`Plant_Id`,`Document_Id`,`Prefix`,`Symbol_Id`,`Suffix`,`Status`,`Created_By`,`Created_On`,`Modified_By`,`Modified_On`,`Sequence_Name`,`W_Sequence_Name`,`Date_Format`,`Table_Name`) VALUES (9,1,15,'ARA',101,'',1,1,'2023-09-25 11:37:25.295000',1,'2023-09-25 11:37:25.295000','AREASeq','W_AREASeq',NULL,'area');
INSERT INTO `Numbering_Schema` (`Numbering_Schema_Id`,`Plant_Id`,`Document_Id`,`Prefix`,`Symbol_Id`,`Suffix`,`Status`,`Created_By`,`Created_On`,`Modified_By`,`Modified_On`,`Sequence_Name`,`W_Sequence_Name`,`Date_Format`,`Table_Name`) VALUES (10,1,16,'RTE',101,'',1,1,'2023-09-25 11:37:25.295000',1,'2023-09-25 11:37:25.295000','ROUTESeq','W_ROUTESeq',NULL,'route');
INSERT INTO `Numbering_Schema` (`Numbering_Schema_Id`,`Plant_Id`,`Document_Id`,`Prefix`,`Symbol_Id`,`Suffix`,`Status`,`Created_By`,`Created_On`,`Modified_By`,`Modified_On`,`Sequence_Name`,`W_Sequence_Name`,`Date_Format`,`Table_Name`) VALUES (11,1,17,'CTY',101,'',1,1,'2023-09-25 11:37:25.295000',1,'2023-09-25 11:37:25.295000','CITYSeq','W_CITYSeq',NULL,'city');
INSERT INTO `Numbering_Schema` (`Numbering_Schema_Id`,`Plant_Id`,`Document_Id`,`Prefix`,`Symbol_Id`,`Suffix`,`Status`,`Created_By`,`Created_On`,`Modified_By`,`Modified_On`,`Sequence_Name`,`W_Sequence_Name`,`Date_Format`,`Table_Name`) VALUES (12,1,18,'DPT',101,'',1,1,'2023-09-25 11:37:25.295000',1,'2023-09-25 11:37:25.295000','DEPARTMENTSeq','W_DEPARTMENTSeq',NULL,'department');
INSERT INTO `Numbering_Schema` (`Numbering_Schema_Id`,`Plant_Id`,`Document_Id`,`Prefix`,`Symbol_Id`,`Suffix`,`Status`,`Created_By`,`Created_On`,`Modified_By`,`Modified_On`,`Sequence_Name`,`W_Sequence_Name`,`Date_Format`,`Table_Name`) VALUES (13,1,19,'GTE',101,'',1,1,'2023-09-25 11:37:25.295000',1,'2023-09-25 11:37:25.295000','GATESeq','W_GATESeq',NULL,'gate');
INSERT INTO `Numbering_Schema` (`Numbering_Schema_Id`,`Plant_Id`,`Document_Id`,`Prefix`,`Symbol_Id`,`Suffix`,`Status`,`Created_By`,`Created_On`,`Modified_By`,`Modified_On`,`Sequence_Name`,`W_Sequence_Name`,`Date_Format`,`Table_Name`) VALUES (14,1,21,'USR',101,'',1,1,'2023-09-25 11:37:25.295000',1,'2023-09-25 11:37:25.295000','USERSeq','W_USERSeq',NULL,'users');
INSERT INTO `Numbering_Schema` (`Numbering_Schema_Id`,`Plant_Id`,`Document_Id`,`Prefix`,`Symbol_Id`,`Suffix`,`Status`,`Created_By`,`Created_On`,`Modified_By`,`Modified_On`,`Sequence_Name`,`W_Sequence_Name`,`Date_Format`,`Table_Name`) VALUES (15,1,22,'RLE',101,'',1,1,'2023-09-25 11:37:25.295000',1,'2023-09-25 11:37:25.295000','ROLESeq','W_ROLESeq',NULL,'role');
INSERT INTO `Numbering_Schema` (`Numbering_Schema_Id`,`Plant_Id`,`Document_Id`,`Prefix`,`Symbol_Id`,`Suffix`,`Status`,`Created_By`,`Created_On`,`Modified_By`,`Modified_On`,`Sequence_Name`,`W_Sequence_Name`,`Date_Format`,`Table_Name`) VALUES (16,1,23,'CSR',101,'',1,1,'2023-09-25 11:37:25.295000',1,'2023-09-25 11:37:25.295000','CUSTOMERSeq','W_CUSTOMERSeq',NULL,'customer');
INSERT INTO `Numbering_Schema` (`Numbering_Schema_Id`,`Plant_Id`,`Document_Id`,`Prefix`,`Symbol_Id`,`Suffix`,`Status`,`Created_By`,`Created_On`,`Modified_By`,`Modified_On`,`Sequence_Name`,`W_Sequence_Name`,`Date_Format`,`Table_Name`) VALUES (17,1,24,'PLT',101,'',1,1,'2023-09-25 11:37:25.295000',1,'2023-09-25 11:37:25.295000','PLANTSeq','W_PLANTSeq',NULL,'plant');
INSERT INTO `Numbering_Schema` (`Numbering_Schema_Id`,`Plant_Id`,`Document_Id`,`Prefix`,`Symbol_Id`,`Suffix`,`Status`,`Created_By`,`Created_On`,`Modified_By`,`Modified_On`,`Sequence_Name`,`W_Sequence_Name`,`Date_Format`,`Table_Name`) VALUES (18,1,40,'WOP',101,'',1,1,'2023-09-25 11:37:25.295000',1,'2023-09-25 11:37:25.295000','WORKPERMITSeq','W_WORKPERMITSeq',NULL,'work_permit');
INSERT INTO `Numbering_Schema` (`Numbering_Schema_Id`,`Plant_Id`,`Document_Id`,`Prefix`,`Symbol_Id`,`Suffix`,`Status`,`Created_By`,`Created_On`,`Modified_By`,`Modified_On`,`Sequence_Name`,`W_Sequence_Name`,`Date_Format`,`Table_Name`) VALUES (19,1,41,'VDR',101,'',1,1,'2023-09-25 11:37:25.295000',1,'2023-09-25 11:37:25.295000','VENDOREGSeq','W_VENDOREGSeq',NULL,'vendor_registration');
INSERT INTO `Numbering_Schema` (`Numbering_Schema_Id`,`Plant_Id`,`Document_Id`,`Prefix`,`Symbol_Id`,`Suffix`,`Status`,`Created_By`,`Created_On`,`Modified_By`,`Modified_On`,`Sequence_Name`,`W_Sequence_Name`,`Date_Format`,`Table_Name`) VALUES (20,1,43,'CPM',101,'',1,1,'2023-09-25 11:37:25.295000',1,'2023-09-25 11:37:25.295000','CATCPMAPSeq','W_CATCPMAPSeq',NULL,'category_cp_map');
INSERT INTO `Numbering_Schema` (`Numbering_Schema_Id`,`Plant_Id`,`Document_Id`,`Prefix`,`Symbol_Id`,`Suffix`,`Status`,`Created_By`,`Created_On`,`Modified_By`,`Modified_On`,`Sequence_Name`,`W_Sequence_Name`,`Date_Format`,`Table_Name`) VALUES (21,1,44,'FED',101,'',1,1,'2023-09-25 11:37:25.295000',1,'2023-09-25 11:37:25.295000','FEEDBACKSeq','W_FEEDBACKSeq',NULL,'feedback'); 
