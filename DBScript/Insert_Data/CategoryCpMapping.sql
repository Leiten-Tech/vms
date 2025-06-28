truncate table Category_CP_Map;
INSERT INTO `Category_CP_Map` (`CP_Map_Id`,`Category_Id`, `Category_Name`, `Status`, `Created_By`, `Created_On`, `Modified_By`, `Modified_On`, `Is_Sys_Generated`)
VALUES
(1,1, 'General', 1, 1, NOW(), NULL, NULL, 1),
(2,2, 'Work At Height', 1, 1, NOW(), NULL, NULL, 0),
(3,3, 'Evacuation & Civil Work', 1, 1, NOW(), NULL, NULL, 0),
(4,4, 'Energy/ Electrical Installation', 1, 1, NOW(), NULL, NULL, 0),
(5,5, 'Machine/ Moving', 1, 1, NOW(), NULL, NULL, 0),
(6,6, 'Hot Work', 1, 1, NOW(), NULL, NULL, 0),
(7,7, 'A M C', 1, 1, NOW(), NULL, NULL, 0),
(8,8, 'Service', 1, 1, NOW(), NULL, NULL, 0),
(9,9, 'Calibration', 1, 1, NOW(), NULL, NULL, 0),
(10,10, 'Inspection & Segregation', 1, 1, NOW(), NULL, NULL, 0);

 

truncate table Category_CP_Map_Details;
INSERT INTO `Category_CP_Map_Details` (`Category_CP_Map_Detail_Id`, `CP_Map_Id`, `Category_Id`, `Description`, `Status`, `Created_By`, `Created_On`, `Modified_By`, `Modified_On`, `Is_Sys_Generated`)
VALUES
(1, 1,1, 'Check the Age of the Manpower (less than 18 and above 50 not allowed)', 1, 1, NOW(), NULL, NULL, 0),
(2, 1,1, 'Explain about the Emergency Exit Route & Safe Assembly point', 1, 1, NOW(), NULL, NULL, 0),
(3, 1,1, 'Wear Minimum PPE: Safety Shoe & Cap', 1, 1, NOW(), NULL, NULL, 0),
(4, 2,2, 'Checked availability & fitness of Platform', 1, 1, NOW(), NULL, NULL, 0),
(5, 2,2, 'Checked availability of safe access of work area', 1, 1, NOW(), NULL, NULL, 0),
(6, 2,2, 'Checked availability of edge protection', 1, 1, NOW(), NULL, NULL, 0),
(7, 2,2, 'Checked availability of light at work spot', 1, 1, NOW(), NULL, NULL, 0),
(8, 2,2, 'Checked availability of safety belt and appliances', 1, 1, NOW(), NULL, NULL, 0),
(9, 2,2, 'Checked availability of provision for fixing safety belts', 1, 1, NOW(), NULL, NULL, 0),
(10, 2,2, 'Checked clearance taken from respective departments in working area', 1, 1, NOW(), NULL, NULL, 0),
(11, 3,3, 'Checked Caution Board for Job in Progress at working area', 1, 1, NOW(), NULL, NULL, 0),
(12, 3,3, 'Checked availability of light at work spot', 1, 1, NOW(), NULL, NULL, 0),
(13, 4,4, 'Checked line is isolated by closing valve and caution board for Job in Progress at working area', 1, 1, NOW(), NULL, NULL, 0),
(14, 4,4, 'Fuses are removed', 1, 1, NOW(), NULL, NULL, 0),
(15, 4,4, 'Control Supply is switched off', 1, 1, NOW(), NULL, NULL, 0),
(16, 4,4, 'Cable is disconnected at machine end', 1, 1, NOW(), NULL, NULL, 0),
(17, 4,4, 'Checked electrical power to pump/valve/compressor is isolated', 1, 1, NOW(), NULL, NULL, 0),
(18, 4,4, 'Checked air and oil from line is drained', 1, 1, NOW(), NULL, NULL, 0),
(19, 4,4, 'Checked availability of water and fire extinguisher near work spot', 1, 1, NOW(), NULL, NULL, 0),
(20, 4,4, 'Checked protection taken to safeguard electrical cables if any near work spot', 1, 1, NOW(), NULL, NULL, 0),
(21, 4,4, 'Checked availability of light at work spot', 1, 1, NOW(), NULL, NULL, 0),
(22, 4,4, 'Checked availability of safety appliances with job performer', 1, 1, NOW(), NULL, NULL, 0),
(23, 4,4, 'Checked third-party inspection certificate of lifting equipment', 1, 1, NOW(), NULL, NULL, 0),
(24, 5,5, 'Checked physical condition of lifting equipment', 1, 1, NOW(), NULL, NULL, 0),
(25, 5,5, 'Maintained safe distance from suspended load', 1, 1, NOW(), NULL, NULL, 0),
(26, 5,5, 'Movement of machine or part is arrested and display board for Job in Progress provided over machine', 1, 1, NOW(), NULL, NULL, 0),
(27, 6, 6, 'Checked flammable or combustible materials are removed from work site or covered with fire blanket', 1, 1, NOW(), NULL, NULL, 0),
(28, 6, 6, 'Checked hazardous substances are removed', 1, 1, NOW(), NULL, NULL, 0),
(29, 6, 6, 'Checked fire extinguishers and water available at work site', 1, 1, NOW(), NULL, NULL, 0),
(30, 6, 6, 'Checked earthing & Flash Arrestor of welding machine for proper lightening', 1, 1, NOW(), NULL, NULL, 0),
(31, 6, 6, 'All electrical cables must be free from cut / loose joints', 1, 1, NOW(), NULL, NULL, 0),
(32, 6, 6, 'Check proper use of PPE', 1, 1, NOW(), NULL, NULL, 0);