DELIMITER //
DROP PROCEDURE IF EXISTS SP_ANDROID_SECURITY_DASHBOARD;
//
CREATE PROCEDURE SP_ANDROID_SECURITY_DASHBOARD
(
	IN CompanyId BIGINT,
    IN RoleId BIGINT,
    IN UserId BIGINT,
    IN serviceUrl VARCHAR(500)
)
BEGIN
	SELECT
         ve.Person_Name AS PersonName,
         U.User_Name AS HostName,
         ve.Visitor_Entry_Code AS VisitorEntryCode,
         ve.Mobile_No AS MobileNo,
         DATE_FORMAT(ve.Valid_From, '%h:%i %p') AS ValidFrom,
         CONCAT(serviceUrl, ve.Visitor_Image_Url) AS VisitorImageUrl,
         ve.Visitor_Type_Id AS VisitorTypeId,
         M1.Meta_Sub_Description AS Statusname,
         M2.Meta_Sub_Description AS PurposeOfVisitName,
         M3.Meta_Sub_Description AS VisitorTypeName,
         U.User_Name AS VisitedEmployeeName,
         (
            SELECT GROUP_CONCAT(DISTINCT m.Area_Name SEPARATOR ', ')
			FROM Visitor_Entry_Atv_Detail B
			INNER JOIN Area m ON m.Area_Id = B.Area_To_Visit
			WHERE B.Visitor_Entry_Id = ve.Visitor_Entry_Id
		 ) AS AreaToVisitName
	FROM visitor_entry ve
    INNER JOIN Metadata M1 ON M1.Meta_Sub_Id = ve.status
    INNER JOIN Users U ON U.User_Id = ve.Visited_Employee_Id
    INNER JOIN Metadata M2 ON M2.Meta_Sub_Id = ve.Purpose_Of_Visit
    INNER JOIN Metadata M3 ON M3.Meta_Sub_Id = ve.Visitor_Type_Id
	WHERE
        (ve.Visitor_Type_Id <> 66 OR ve.is_android_visitor = 1)
		AND ve.Status = 75
		AND DATE(ve.Valid_From) = CURDATE()
		AND ve.Valid_From BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 30 MINUTE)
		AND ve.company_Id = CompanyId;
END;
//
DELIMITER ;
