truncate table category;
INSERT INTO `Category` (`Category_Id`,`Category_Name`, `Status`, `Created_By`, `Created_On`, `Modified_By`, `Modified_On`,`Is_Sys_Generated`)
VALUES
(1,'General', 1, 1, NOW(), NULL, NULL, 1),
(2,'Work At Height', 1, 1, NOW(), NULL, NULL, 0),
(3,'Evacuation & Civil Work', 1, 1, NOW(), NULL, NULL, 0),
(4,'Energy/ Electrical Installation', 1, 1, NOW(), NULL, NULL, 0),
(5,'Machine/ Moving', 1, 1, NOW(), NULL, NULL, 0),
(6,'Hot Work', 1, 1, NOW(), NULL, NULL, 0),
(7,'A M C', 1, 1, NOW(), NULL, NULL, 0),
(8,'Service', 1, 1, NOW(), NULL, NULL, 0),
(9,'Calibration', 1, 1, NOW(), NULL, NULL, 0),
(10,'Inspection & Segregation', 1, 1, NOW(), NULL, NULL, 0);

