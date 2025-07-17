DELIMITER //

DROP PROCEDURE IF EXISTS SP_VISITOR_DASHBOARD;
//
CREATE PROCEDURE SP_VISITOR_DASHBOARD
(
	IN Type LONGTEXT,
	IN CompanyId BIGINT
)
BEGIN
	IF Type = 'GetVisitorDetail' THEN

    -- Visitor Entry List
		SELECT
         ve.Person_Name AS PersonName
        ,'Person Name' AS PersonLabel
        ,'Host' AS HostLabel
        ,'Area/Floor' AS AreaLabel
        ,ve.Visitor_Entry_Code AS VisitorEntryCode
        ,ve.Mobile_No AS MobileNo
		,CONCAT(
		DATE_FORMAT(ve.Valid_From, '%h:%i %p'),
		' - ',
		DATE_FORMAT(ve.Valid_To, '%h:%i %p')
		) AS ValidFrom
        ,ve.Visitor_Image_Url AS VisitorImageUrl
        ,ve.Visitor_Type_Id AS VisitorTypeId
        ,M1.Meta_Sub_Description AS Statusname
        ,M2.Meta_Sub_Description AS PurposeOfVisitName
        ,M3.Meta_Sub_Description AS VisitorTypeName
        ,U.User_Name AS VisitedEmployeeName
        ,(
            SELECT GROUP_CONCAT(DISTINCT m.Area_Name SEPARATOR ', ') AS AreaToVisitName
			FROM Visitor_Entry_Atv_Detail B
			INNER JOIN Area m ON m.Area_Id = b.Area_To_Visit
			WHERE B.Visitor_Entry_Id = ve.Visitor_Entry_Id
		) AS AreaToVisitName
        
		FROM visitor_entry ve
        LEFT JOIN Metadata M1 on M1.Meta_Sub_Id = ve.status
        LEFT JOIN Users U on U.User_Id = ve.Visited_Employee_Id
        LEFT JOIN Metadata M2 on M2.Meta_Sub_Id = ve.Purpose_Of_Visit
        LEFT JOIN Metadata M3 on M3.Meta_Sub_Id = ve.Visitor_Type_Id
        WHERE
			ve.Visitor_Type_Id <> 66
		AND 
			ve.Status = 75
		AND
			DATE(ve.Valid_From) = CURDATE()
		AND 
			ve.Valid_From BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 30 MINUTE)
		AND
            ve.company_Id = CompanyId;
                    
		-- Vechicle Entry List
        
		SELECT
         ve.Driver_Name AS PersonName
        ,'Driver Name' AS PersonLabel
        ,'Host' AS HostLabel
        ,'Area/Floor' AS AreaLabel
        ,ve.Vehicle_No AS VisitorEntryCode
        ,ve.Mobile_No AS MobileNo
		,CONCAT(
		DATE_FORMAT(ve.Valid_From, '%h:%i %p'),
		' - ',
		DATE_FORMAT(ve.Valid_To, '%h:%i %p')
		) AS ValidFrom
        ,ve.Visitor_Image_Url AS VisitorImageUrl
        ,ve.Visitor_Type_Id AS VisitorTypeId
        ,M1.Meta_Sub_Description AS Statusname
        ,M2.Meta_Sub_Description AS PurposeOfVisitName
        ,M3.Meta_Sub_Description AS VisitorTypeName
        ,U.User_Name AS VisitedEmployeeName
        ,
		(
            SELECT GROUP_CONCAT(DISTINCT m.Area_Name SEPARATOR ', ') AS AreaToVisitName
			FROM Visitor_Entry_Atv_Detail B
			INNER JOIN Area m ON m.Area_Id = b.Area_To_Visit
			WHERE B.Visitor_Entry_Id = ve.Visitor_Entry_Id
		) AS AreaToVisitName
        
		FROM visitor_entry ve
        LEFT JOIN Metadata M1 on M1.Meta_Sub_Id = ve.status
        LEFT JOIN Users U on U.User_Id = ve.Visited_Employee_Id
        LEFT JOIN Metadata M2 on M2.Meta_Sub_Id = ve.Purpose_Of_Visit
        LEFT JOIN Metadata M3 on M3.Meta_Sub_Id = ve.Visitor_Type_Id
        WHERE
			ve.Visitor_Type_Id = 66
		AND
			ve.Status = 75
		AND
			DATE(ve.Valid_From) = CURDATE()
		AND 
			ve.Valid_From BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 30 MINUTE)		
		AND
            ve.company_Id = CompanyId;
	END IF;
END;
//

DELIMITER ;