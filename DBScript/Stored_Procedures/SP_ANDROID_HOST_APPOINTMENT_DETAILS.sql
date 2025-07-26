DROP PROCEDURE IF EXISTS SP_ANDROID_HOST_APPOINTMENT_DETAILS;
DELIMITER //
CREATE PROCEDURE `SP_ANDROID_HOST_APPOINTMENT_DETAILS`(
    IN _UserId INT,
    IN serviceurl VARCHAR(255)
)
BEGIN
    -- REQUEST INFORMATION
  SELECT * FROM (
        SELECT
		C.Company_Id AS CompanyId,
		A.Company_Name AS CompanyName,
		PL.Plant_Id AS PlantId,
		PL.Plant_Name AS PlantName,
		H.Visitor_Entry_Code AS VisitorEntryCode,
		DATE_FORMAT(H.Valid_from, '%d-%m-%Y %h:%i %p') AS RequestDate,
		H.Visitor_Id AS VisitorId,
		CONCAT(A.user_name COLLATE utf8mb4_unicode_ci, ' - ', H.Visitor_Entry_Code COLLATE utf8mb4_unicode_ci) AS VisitorName,
		0  AS HostId,
		HO.User_Name AS HostName,
		MT.Meta_Sub_Description AS PurposeOfVisit,
		PL.Address,
		H.status,
		'NO' AS CheckIn,
		CONCAT(serviceurl, H.Visitor_Image_Url) AS Imageurl,
		'NO' AS CheckOut,
		'' AS Visitorcheckout,
		H.is_meeting_close AS meetingclose,
		H.Visit_End_Time AS VisitEndTime,
		PL.Alert_After_Mins AS AlterAfterMins,
		H.Visitor_Entry_Id
        FROM visitor_entry H 
        INNER JOIN android_users A ON A.user_id = H.Visitor_Id 
        INNER JOIN users HO ON HO.User_Id = H.Visited_Employee_Id
        INNER JOIN company C ON C.Company_Id = HO.Company_Id
        INNER JOIN plant PL ON PL.Company_Id = C.Company_Id AND PL.Plant_Id = H.Plant_Id
        INNER JOIN metadata MT ON MT.Meta_Sub_Id = H.Purpose_Of_Visit
        INNER JOIN approval_detail AP ON AP.Document_No = H.Visitor_Entry_Code AND AP.Primary_User_Id = 0 AND AP.status = 74
        WHERE H.Visited_Employee_Id = _UserId AND H.Status = 74

        UNION ALL

        SELECT
		C.Company_Id AS CompanyId,
		A.Company_Name AS CompanyName,
		PL.Plant_Id AS PlantId,
		PL.Plant_Name AS PlantName,
		H.Visitor_Entry_Code AS VisitorEntryCode,
		DATE_FORMAT(H.Valid_from, '%d-%m-%Y %h:%i %p') AS RequestDate,
		H.Visitor_Id AS VisitorId,
		CONCAT(A.user_name COLLATE utf8mb4_unicode_ci, ' - ', H.Visitor_Entry_Code COLLATE utf8mb4_unicode_ci) AS VisitorName,
		H.Visited_Employee_Id AS HostId,
		HO.User_Name AS HostName,
		MT.Meta_Sub_Description AS PurposeOfVisit,
		PL.Address,
		H.status,
		'NO' AS CheckIn,
		CONCAT(serviceurl, H.Visitor_Image_Url) AS Imageurl,
		'NO' AS CheckOut,
		'' AS Visitorcheckout,
		H.is_meeting_close AS meetingclose,
		H.Visit_End_Time AS VisitEndTime,
		PL.Alert_After_Mins AS AlterAfterMins,
		H.Visitor_Entry_Id
        FROM visitor_entry H 
        INNER JOIN android_users A ON A.user_id = H.Visitor_Id 
        INNER JOIN users HO ON HO.User_Id = H.Visited_Employee_Id
        INNER JOIN company C ON C.Company_Id = HO.Company_Id
        INNER JOIN plant PL ON PL.Company_Id = C.Company_Id AND PL.Plant_Id = H.Plant_Id
        INNER JOIN metadata MT ON MT.Meta_Sub_Id = H.Purpose_Of_Visit
        INNER JOIN approval_detail AP ON AP.Document_No = H.Visitor_Entry_Code AND AP.Primary_User_Id = _UserId  AND AP.status = 74
        WHERE H.Status = 74
    ) AS Combined
    ORDER BY Combined.Visitor_Entry_Id DESC;

    -- APPROVED INFORMATION
    SELECT 
	C.Company_Id AS CompanyId,
	A.Company_Name AS CompanyName,
	PL.Plant_Id AS PlantId,
	PL.Plant_Name AS PlantName,
	H.Visitor_Entry_Code AS VisitorEntryCode,
	DATE_FORMAT(H.Valid_from, '%d-%m-%Y %h:%i %p') AS RequestDate,
	H.Visitor_Id AS VisitorId,
	CONCAT(A.user_name, ' - ', H.Visitor_Entry_Code)VisitorName,
	H.Visited_Employee_Id AS HostId,
	HO.User_Name AS HostName,
	MT.Meta_Sub_Description AS PurposeOfVisit,
	PL.Address,
	H.status,
    CASE WHEN CICO.Checked_In IS NOT NULL THEN 'YES' ELSE 'NO' END CheckIn,
    CONCAT(serviceurl, H.Visitor_Image_Url) AS Imageurl,
    CASE WHEN (CICO.Checked_Out IS NOT NULL OR H.is_meeting_close = 1) THEN 'YES' ELSE 'NO' END CheckOut,
     CICO.Checked_Out as Visitorcheckout,
        H.is_meeting_close as meetingclose,
     H.Visit_End_Time  as VisitEndTime,
     PL.Alert_After_Mins as AlterAfterMins
    
    FROM visitor_entry H 
    INNER JOIN android_users A ON A.user_id = H.Visitor_Id 
    INNER JOIN users HO ON HO.User_Id = H.Visited_Employee_Id
    INNER JOIN company C ON C.Company_Id = HO.Company_Id
    INNER JOIN plant PL ON PL.Company_Id = C.Company_Id AND PL.Plant_Id = H.Plant_Id
    INNER JOIN metadata MT ON MT.Meta_Sub_Id = H.Purpose_Of_Visit
    INNER JOIN approval_detail AP ON AP.Document_No = H.Visitor_Entry_Code
    AND ((H.Visited_Employee_Id = _UserId AND AP.Primary_User_Id = 0) OR (AP.Primary_User_Id = _UserId)) AND AP.status = 75
    LEFT JOIN visitor_entry_log CICO ON CICO.Visitor_Entry_Code = H.Visitor_Entry_Code  
    WHERE  ((H.is_meeting_close = 0 OR H.is_meeting_close IS NULL) AND CICO.Checked_Out IS NULL) AND H.Status = 75 order by H.Visitor_Entry_Id desc;

    -- REJECTED INFORMATION
    SELECT 
	C.Company_Id AS CompanyId,
	A.Company_Name AS CompanyName,
	PL.Plant_Id AS PlantId,
	PL.Plant_Name AS PlantName,
	H.Visitor_Entry_Code AS VisitorEntryCode,
	DATE_FORMAT(H.Valid_from, '%d-%m-%Y %h:%i %p') AS RequestDate,
	H.Visitor_Id AS VisitorId,
	CONCAT(A.user_name, ' - ', H.Visitor_Entry_Code)VisitorName,
	H.Visited_Employee_Id AS HostId,
	HO.User_Name AS HostName,
	MT.Meta_Sub_Description AS PurposeOfVisit,
	PL.Address,
	H.status,
	CONCAT(serviceurl, H.Visitor_Image_Url) AS Imageurl,
     'NO' AS  CheckOut,
           '' as Visitorcheckout,
        H.is_meeting_close as meetingclose,
     H.Visit_End_Time as VisitEndTime,
          PL.Alert_After_Mins as AlterAfterMins
     
    FROM visitor_entry H 
    INNER JOIN android_users A ON A.user_id = H.Visitor_Id 
    INNER JOIN users HO ON HO.User_Id = H.Visited_Employee_Id
    INNER JOIN company C ON C.Company_Id = HO.Company_Id
    INNER JOIN plant PL ON PL.Company_Id = C.Company_Id AND PL.Plant_Id = H.Plant_Id
    INNER JOIN metadata MT ON MT.Meta_Sub_Id = H.Purpose_Of_Visit
	INNER JOIN approval_detail AP ON AP.Document_No = H.Visitor_Entry_Code
    AND ((H.Visited_Employee_Id = _UserId AND AP.Primary_User_Id = 0) OR (AP.Primary_User_Id = _UserId)) AND AP.status = 76
    WHERE H.Visited_Employee_Id = _UserId AND H.Status = 76 order by H.Visitor_Entry_Id desc ;
    
      -- COMPLETED INFORMATION
    SELECT 
	C.Company_Id AS CompanyId,
	A.Company_Name AS CompanyName,
	PL.Plant_Id AS PlantId,
	PL.Plant_Name AS PlantName,
	H.Visitor_Entry_Code AS VisitorEntryCode,
	DATE_FORMAT(H.Valid_from, '%d-%m-%Y %h:%i %p') AS RequestDate,
	H.Visitor_Id AS VisitorId,
	CONCAT(A.user_name, ' - ', H.Visitor_Entry_Code)VisitorName,
	H.Visited_Employee_Id AS HostId,
	HO.User_Name AS HostName,
	MT.Meta_Sub_Description AS PurposeOfVisit,
	PL.Address,
	H.status,
    CASE WHEN CICO.Checked_In IS NOT NULL THEN 'YES' ELSE 'NO' END CheckIn,
        CONCAT(serviceurl, H.Visitor_Image_Url) AS Imageurl,
    CASE WHEN (CICO.Checked_Out IS NOT NULL OR H.is_meeting_close = 1) THEN 'YES' ELSE 'NO' END CheckOut,
        CICO.Checked_Out as Visitorcheckout,
        H.is_meeting_close as meetingclose,
     H.Visit_End_Time as VisitEndTime,
          PL.Alert_After_Mins as AlterAfterMins
    
    FROM visitor_entry H 
    INNER JOIN android_users A ON A.user_id = H.Visitor_Id 
    INNER JOIN users HO ON HO.User_Id = H.Visited_Employee_Id
    INNER JOIN company C ON C.Company_Id = HO.Company_Id
    INNER JOIN plant PL ON PL.Company_Id = C.Company_Id AND PL.Plant_Id = H.Plant_Id
    INNER JOIN metadata MT ON MT.Meta_Sub_Id = H.Purpose_Of_Visit
    INNER JOIN visitor_entry_log CICO ON CICO.Visitor_Entry_Code = H.Visitor_Entry_Code
    INNER JOIN approval_detail AP ON AP.Document_No = H.Visitor_Entry_Code
    AND ((H.Visited_Employee_Id = _UserId AND AP.Primary_User_Id = 0) OR (AP.Primary_User_Id = _UserId)) AND AP.status = 75
    
    WHERE H.Visited_Employee_Id = _UserId AND H.Status = 75 AND CICO.Checked_In IS NOT NULL AND (CICO.Checked_Out IS NOT NULL OR H.is_meeting_close = 1)
    
    order by H.Visitor_Entry_Id desc;

END //

DELIMITER ;
