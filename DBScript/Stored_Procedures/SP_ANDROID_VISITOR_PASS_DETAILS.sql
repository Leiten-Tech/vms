DROP PROCEDURE IF EXISTS SP_ANDROID_VISITOR_PASS_DETAILS;
DELIMITER //

CREATE PROCEDURE `SP_ANDROID_VISITOR_PASS_DETAILS`(
    IN _VisitorRequestNo VARCHAR(100) ,
        IN serviceurl VARCHAR(255)
)
BEGIN
    -- PASS INFORMATION
    SELECT
        C.Company_Id AS CompanyId,
        C.Company_Name AS CompanyName,
        PL.Plant_Id AS PlantId,
        PL.Plant_Name AS PlantName,
        H.Visitor_Entry_Code AS VisitorEntryCode,
        DATE_FORMAT(H.Valid_From, '%d-%m-%Y %h:%i %p') AS RequestDate,
        H.Visitor_Id AS VisitorId,
        A.user_name AS VisitorName,
        H.Mobile_No As VisitorContactNo,
        H.Visited_Employee_Id AS HostId,
        HO.User_Name AS HostName,
        HO.User_Tel_No AS HostContactNo,
        MT.Meta_Sub_Description AS PurposeOfVisit,
        PL.Address,
        H.status,
        CASE WHEN CICO.Checked_In IS NOT NULL THEN TRUE ELSE FALSE END AS CheckIn,
        CASE WHEN CICO.Checked_Out IS NOT NULL THEN TRUE ELSE FALSE END AS CheckOut,
          CONCAT(serviceurl, H.Visitor_Image_Url) AS Visitor_Image_Url,
        DATE_FORMAT(CICO.Checked_In, '%d-%m-%Y %h:%i %p') AS CheckedInDate,
        DATE_FORMAT(CICO.Checked_Out, '%d-%m-%Y %h:%i %p') AS CheckedOutDate
          
    FROM visitor_entry H 
    INNER JOIN android_users A ON A.user_id = H.Visitor_Id AND H.is_android_visitor = 1
    INNER JOIN users HO ON HO.User_Id = H.Visited_Employee_Id
    INNER JOIN company C ON C.Company_Id = HO.Company_Id
    INNER JOIN plant PL ON PL.Company_Id = C.Company_Id AND PL.Plant_Id = H.Plant_Id
    INNER JOIN metadata MT ON MT.Meta_Sub_Id = H.Purpose_Of_Visit
    LEFT JOIN visitor_entry_log CICO ON CICO.Visitor_Entry_Code = H.Visitor_Entry_Code
    WHERE H.Visitor_Entry_Code = _VisitorRequestNo AND H.Status = 75;

    -- BELONGINGS INFORMATION
    SELECT
        VB.Device_Name,
        VB.Device_No
    FROM visitor_entry H
    INNER JOIN visitor_entry_belonging_detail VB ON VB.Visitor_Entry_Id = H.Visitor_Entry_Id
    WHERE H.Visitor_Entry_Code = _VisitorRequestNo;

END //

DELIMITER ;
