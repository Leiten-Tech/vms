DELIMITER $$
DROP procedure IF EXISTS SP_JOB_VISITOR_CHECKIN_CHECKOUT_REPORT;
CREATE PROCEDURE SP_JOB_VISITOR_CHECKIN_CHECKOUT_REPORT (
    IN FromDate DATE,
    IN ToDate DATE,
    IN PlantIds VARCHAR(255),
    IN VisitorTypeId VARCHAR(255),
    IN PurposeOfVisit VARCHAR(255),
    IN PlantId VARCHAR(255),
    IN CompanyId VARCHAR(255),    
    IN Scheme VARCHAR(255),
    IN SignScheme VARCHAR(255)
)
BEGIN
    -- Drop temporary table if exists
    DROP TEMPORARY TABLE IF EXISTS TempReportSelect;

    -- Recreate your query (your big SELECT ... UNION ALL ... logic goes here)
    CREATE TEMPORARY TABLE TempReportSelect AS
    SELECT *
    FROM (

		SELECT DISTINCT
			v.Plant_Id AS PlantId,
			v.Visitor_Type_Id AS VisitorTypeId,
			'One Day Pass' AS VisitorTypeName,
			CONCAT(vd.First_Name, ' ', vd.Last_Name) AS VisitorName,
			v.Mobile_No AS MobileNo,
			v.Visited_Employee_Id AS VisitedEmployeeId,
			u2.User_Name AS VisitorEmpName,
			v.Purpose_Of_Visit AS PurposeOfVisit,
			m4.Meta_Sub_Description AS PurposeOfVisitName,
			CONCAT(Scheme,vd.Document_Url) AS VisitorImageUrl,
			v.Visitor_Entry_Code AS VisitorEntryCode,
			p.Plant_Name AS PlantName,
			IFNULL(vi.Visitor_Company, "-") as VisitorCompany,
			IFNULL(DATE_FORMAT(v.Visitor_Entry_Date, '%Y-%m-%d %H:%i:%s'), '') AS VisitorEntryDate,
			IFNULL(DATE_FORMAT(vl.Checked_In, '%Y-%m-%d %H:%i:%s'), '') AS CheckedIn,
			IFNULL(DATE_FORMAT(vl.Checked_out, '%Y-%m-%d %H:%i:%s'), '') AS CheckedOut,
			CASE WHEN vl.Checked_out IS NULL THEN ''
				 ELSE CONCAT(TIMESTAMPDIFF(MINUTE, vl.Checked_In, vl.Checked_Out), ' Minutes')
			END AS StayTime,
			u.User_Name AS CheckedInBy,
			IFNULL(u1.User_Name, '') AS CheckedOutBy,
			(SELECT GROUP_CONCAT(DISTINCT m.Area_Name SEPARATOR ', ') 
			 FROM Visitor_Entry_Atv_Detail b 
			 INNER JOIN Area m ON m.Area_Id = b.Area_To_Visit 
			 WHERE b.Visitor_Entry_Id = v.Visitor_Entry_Id) AS AreatoVisitName,
			 CASE 
				WHEN vd.Digital_Sign_Name IS NULL OR vd.Digital_Sign_Name = '' THEN '-' 
				ELSE CONCAT(SignScheme,vd.Digital_Sign_Name)
				END AS DigitalSignUrl,
				IFNULL(i.Points,'-') AS Points,
				IFNULL(i.Version,'-') AS Version,
				vd.Is_Terms_Agreed AS IsTermsAgreed,
			'-' AS VehicleNo,
			'-' AS VehicleTypeName,
			'-' AS VehicleModel,
			'-' AS DriverName,
			'-' AS VisitorRemarks
		FROM 
			Visitor_Entry_Log vl
			INNER JOIN Visitor_Entry_Detail vd ON vd.Visitor_Entry_Detail_Id = vl.Visitor_Entry_Detail_Id
			INNER JOIN Visitor_Entry v ON v.Visitor_Entry_Id = vd.Visitor_Entry_Id AND vl.Visitor_Entry_Code = v.Visitor_Entry_Code AND v.Visitor_Type_Id = 35
			LEFT JOIN visitor_detail vid on vid.Visitor_Detail_Id = vd.Visitor_Id
			LEFT JOIN visitor vi ON vi.Visitor_Id = vid.Visitor_Id
			INNER JOIN Plant p ON p.Plant_Id = v.Plant_Id
			INNER JOIN Users u2 ON u2.User_Id = v.Visited_Employee_Id
			INNER JOIN Metadata m ON m.Meta_Sub_Id = vd.Title_id
			INNER JOIN Metadata m4 ON m4.Meta_Sub_Id = v.Purpose_Of_Visit
			-- INNER JOIN Visitor_Entry_Log vl ON vl.Visitor_Entry_Code = v.Visitor_Entry_Code AND vl.Visitor_Entry_Detail_Id = vd.Visitor_Entry_Detail_Id
			INNER JOIN Users u ON u.User_Id = vl.Created_By
			LEFT JOIN Users u1 ON u1.User_Id = vl.Modified_By
			LEFT JOIN instructions i on vd.Signed_Version = i.Version and i.Visitor_Type_Id = 35
			
		WHERE
		date(vl.Checked_In) BETWEEN date(FromDate)
							   AND date(ToDate) and vl.Checked_In  is not null and
		v.Company_Id = CompanyId
			-- vl.Checked_In BETWEEN STR_TO_DATE(FromDate, '%Y-%m-%dT%H:%i:%s') 
	--                            AND STR_TO_DATE(ToDate, '%Y-%m-%dT%H:%i:%s')
		
		UNION ALL
		
		SELECT DISTINCT
			v.Plant_Id AS PlantId,
			v.Visitor_Type_Id AS VisitorTypeId,
			'Extended Pass' AS VisitorTypeName,
			CONCAT(vd.First_Name, ' ', vd.Last_Name) AS VisitorName,
			v.Mobile_No AS MobileNo,
			v.Visited_Employee_Id AS VisitedEmployeeId,
			u2.User_Name AS VisitorEmpName,
			v.Purpose_Of_Visit AS PurposeOfVisit,
			m4.Meta_Sub_Description AS PurposeOfVisitName,
			CONCAT(Scheme,vd.Document_Url) AS VisitorImageUrl,
			v.Visitor_Entry_Code AS VisitorEntryCode,
			p.Plant_Name AS PlantName,
			IFNULL(vi.Visitor_Company, "-") as VisitorCompany,
			IFNULL(DATE_FORMAT(v.Visitor_Entry_Date, '%Y-%m-%d %H:%i:%s'), '') AS VisitorEntryDate,
			IFNULL(DATE_FORMAT(vl.Checked_In, '%Y-%m-%d %H:%i:%s'), '-') AS CheckedIn,
			IFNULL(DATE_FORMAT(vl.Checked_out, '%Y-%m-%d %H:%i:%s'), '-') AS CheckedOut,
			CASE WHEN vl.Checked_out IS NULL THEN '-'
				 ELSE CONCAT(TIMESTAMPDIFF(MINUTE, vl.Checked_In, vl.Checked_out), ' Minutes')
			END AS StayTime,
			u.User_Name AS CheckedInBy,
			IFNULL(u1.User_Name, '-') AS CheckedOutBy,
			(SELECT GROUP_CONCAT(DISTINCT m.Area_Name SEPARATOR ', ') 
			 FROM Visitor_Entry_Atv_Detail b 
			 INNER JOIN Area m ON m.Area_Id = b.Area_To_Visit 
			 WHERE b.Visitor_Entry_Id = v.Visitor_Entry_Id) AS AreatoVisitName,
			 CASE 
				WHEN vd.Digital_Sign_Name IS NULL OR vd.Digital_Sign_Name = '' THEN '-' 
				ELSE CONCAT(SignScheme,vd.Digital_Sign_Name) 
				END AS DigitalSignUrl,
				IFNULL(i.Points,'-') AS Points,
				IFNULL(i.Version,'-') AS Version,
				vd.Is_Terms_Agreed AS IsTermsAgreed,
			'-' AS VehicleNo,
			'-' AS VehicleTypeName,
			'-' AS VehicleModel,
			'-' AS DriverName,
			'-' AS VisitorRemarks
		FROM 
		Visitor_Entry_Log vl
			INNER JOIN Visitor_Entry_Detail vd ON vd.Visitor_Entry_Detail_Id = vl.Visitor_Entry_Detail_Id
			INNER JOIN Visitor_Entry v ON v.Visitor_Entry_Id = vd.Visitor_Entry_Id AND vl.Visitor_Entry_Code = v.Visitor_Entry_Code AND v.Visitor_Type_Id = 36
			-- Visitor_Entry_Detail vd
	--         INNER JOIN Visitor_Entry v ON v.Visitor_Entry_Id = vd.Visitor_Entry_Id AND v.Visitor_Type_Id = 36
			LEFT JOIN visitor_detail vid on vid.Visitor_Detail_Id = vd.Visitor_Id
			LEFT JOIN visitor vi ON vi.Visitor_Id = vid.Visitor_Id
			INNER JOIN Plant p ON p.Plant_Id = v.Plant_Id
			LEFT JOIN Users u2 ON u2.User_Id = v.Visited_Employee_Id
			LEFT JOIN Metadata m ON m.Meta_Sub_Id = vd.Title_id
			INNER JOIN Metadata m4 ON m4.Meta_Sub_Id = v.Purpose_Of_Visit
			-- LEFT JOIN Visitor_Entry_Log vl ON vl.Visitor_Entry_Code = v.Visitor_Entry_Code AND vl.Visitor_Entry_Detail_Id = vd.Visitor_Entry_Detail_Id
			LEFT JOIN Users u ON u.User_Id = vl.Created_By
			LEFT JOIN Users u1 ON u1.User_Id = vl.Modified_By
			LEFT JOIN instructions i on vd.Signed_Version = i.Version and i.Visitor_Type_Id = 35
		WHERE 
			date(vl.Checked_In) BETWEEN date(FromDate)
							   AND date(ToDate) and vl.Checked_In  is not null
		and v.Company_Id = CompanyId
			-- vl.Checked_In BETWEEN STR_TO_DATE(FromDate, '%Y-%m-%dT%H:%i:%s') 
	--                            AND STR_TO_DATE(ToDate, '%Y-%m-%dT%H:%i:%s')
		
		UNION ALL
		
		SELECT DISTINCT
			v.Plant_Id AS PlantId,
			v.Visitor_Type_Id AS VisitorTypeId,
			m.Meta_Sub_Description AS VisitorTypeName,
			v.Person_Name AS VisitorName,
			v.Mobile_No AS MobileNo,
			v.Visited_Employee_Id AS VisitedEmployeeId,
			u2.User_Name AS VisitorEmpName,
			v.Purpose_Of_Visit AS PurposeOfVisit,
			m4.Meta_Sub_Description AS PurposeOfVisitName,
			v.Visitor_Image_Url AS VisitorImageUrl,
			v.Visitor_Entry_Code AS VisitorEntryCode,
			p.Plant_Name AS PlantName,
			"-" as VisitorCompany,
			IFNULL(DATE_FORMAT(v.Visitor_Entry_Date, '%Y-%m-%d %H:%i:%s'), '') AS VisitorEntryDate,
			IFNULL(DATE_FORMAT(v.Entry_Time, '%Y-%m-%d %H:%i:%s'), '') AS CheckedIn,
			IFNULL(DATE_FORMAT(v.Exit_Time, '%Y-%m-%d %H:%i:%s'), '') AS CheckedOut,
			CASE WHEN v.Exit_Time IS NULL THEN ''
				 ELSE CONCAT(TIMESTAMPDIFF(MINUTE, v.Entry_Time, v.Exit_Time), ' Minutes')
			END AS StayTime,
			u.User_Name AS CheckedInBy,
			'' AS CheckedOutBy,
			(SELECT GROUP_CONCAT(DISTINCT m.Area_Name SEPARATOR ', ') 
			 FROM Visitor_Entry_Atv_Detail b 
			 INNER JOIN Area m ON m.Area_Id = b.Area_To_Visit 
			 WHERE b.Visitor_Entry_Id = v.Visitor_Entry_Id) AS AreatoVisitName,
			 '-' AS DigitalSignUrl,
			'-' AS Points,
			'-' AS Version,
			'-' AS IsTermsAgreed,
			v.Vehicle_No VehicleNo,
			m5.Meta_Sub_Description VehicleTypeName,
			v.Vehicle_Model VehicleModel,
			IFNULL(u2.User_Name, v.Driver_Name) DriverName,
			v.Visitor_Remarks AS VisitorRemarks
		FROM 
			Visitor_Entry v
			INNER JOIN Metadata m ON m.Meta_Sub_Id = v.Visitor_Type_Id
			INNER JOIN Plant p ON p.Plant_Id = v.Plant_Id
			left JOIN Users u2 ON u2.User_Id = v.Visited_Employee_Id
			left JOIN Users u ON u.User_Id = v.Created_By
			left join users u3 on u2.User_Id = v.Driver_Id
			INNER JOIN Metadata m4 ON m4.Meta_Sub_Id = v.Purpose_Of_Visit
			inner join Metadata m5 on m5.Meta_Sub_Id = v.Vehicle_Type_Id
		WHERE 
			Visitor_Type_Id = 66 AND 
		date(v.Entry_Time) BETWEEN date(FromDate)
							   AND date(ToDate)
							   and v.Company_Id = CompanyId
			-- v.Created_On BETWEEN STR_TO_DATE(FromDate, '%Y-%m-%dT%H:%i:%s') 
	--                           AND STR_TO_DATE(ToDate, '%Y-%m-%dT%H:%i:%s')

		UNION ALL
		
		   SELECT DISTINCT
			wp.Plant_Id AS PlantId,
			117 AS VisitorTypeId,
			'Work Permit' AS VisitorTypeName,
			wd.Worker_Name AS VisitorName,
			wd.Mobile_No AS MobileNo,
			wp.Work_Organizer AS VisitedEmployeeId,
			u2.User_Name AS VisitorEmpName,
			117 AS PurposeOfVisit,
			'Work Permit' AS PurposeOfVisitName,
			wd.Profile_Img_Url AS VisitorImageUrl,
			CONCAT('WD000', wd.WP_Worker_Detail_Id) AS VisitorEntryCode,
			p.Plant_Name AS PlantName,
			IFNULL(DATE_FORMAT(wp.Work_Permit_Date , '%Y-%m-%d %H:%i:%s'), '') AS VisitorEntryDate,
			IFNULL(DATE_FORMAT(vl.Checked_In, '%Y-%m-%d %H:%i:%s'), '') AS CheckedIn,
			IFNULL(DATE_FORMAT(vl.Checked_Out, '%Y-%m-%d %H:%i:%s'), '') AS CheckedOut,
			CASE WHEN vl.Checked_Out IS NULL THEN ''
				 ELSE CONCAT(TIMESTAMPDIFF(MINUTE, vl.Checked_In, vl.Checked_Out), ' Minutes')
			END AS StayTime,
			u.User_Name AS CheckedInBy,
			'' AS CheckedOutBy,
			'' AS AreatoVisitName,
			"-" as VisitorCompany,
			'-' AS DigitalSignUrl,
			'-' AS Points,
			'-' AS Version,
			'-' AS IsTermsAgreed,
			'-' AS VehicleNo,
			'-' AS VehicleTypeName,
			'-' AS VehicleModel,
			'-' AS DriverName,
			'-' AS VisitorRemarks
		FROM 
			Work_Permit wp
			inner join wp_worker_detail wd on wp.Work_Permit_Id = wd.Work_Permit_Id
			left join visitor_entry_log vl on vl.Visitor_Entry_Code = wp.Work_Permit_Code and vl.Visitor_Entry_Detail_Id=wd.WP_Worker_Detail_Id
			INNER JOIN Plant p ON p.Plant_Id = wp.Plant_Id
			left JOIN Users u2 ON u2.User_Id = wp.Work_Organizer
			left JOIN Users u ON u.User_Id = wp.Created_By
		WHERE 
		date(vl.Checked_In) BETWEEN date(FromDate)
							   AND date(ToDate) and vl.Checked_In  is not null  and p.Check_Token is not null and p.Check_Token != "" and
								wp.Company_Id = CompanyId
							   
) AS A;

-- Select from the temporary table with conditions
	SELECT * FROM TempReportSelect T
	WHERE 
	((PlantIds IS NULL OR PlantIds = '') OR FIND_IN_SET(T.PlantId, PlantIds) > 0) AND
    ((VisitorTypeId IS NULL OR VisitorTypeId = '') OR FIND_IN_SET(T.VisitorTypeId, VisitorTypeId) > 0) AND
    ((PurposeOfVisit IS NULL OR PurposeOfVisit = '') OR FIND_IN_SET(T.PurposeOfVisit, PurposeOfVisit) > 0);



END$$

DELIMITER ;
