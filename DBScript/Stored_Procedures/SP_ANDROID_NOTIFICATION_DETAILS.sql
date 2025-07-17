DROP PROCEDURE IF EXISTS SP_ANDROID_NOTIFICATION_DETAILS;
DELIMITER //
CREATE PROCEDURE `SP_ANDROID_NOTIFICATION_DETAILS`(
    IN _MobileNo varchar(250) 
)
BEGIN
    -- NEW NOTIFICATION
  SELECT
    H.notification_id AS NotificationId,
    H.Visitor_Entry_Code AS VisitorEntryCode,
    DATE_FORMAT(H.Visitor_Entry_Date, '%d-%m-%Y %h:%i %p') AS RequestDate,
    HO.user_id AS VisitorId,
    H.notification_message As PurposeOfVisit,
    (HO.user_name) AS VisitorName,
    H.Visitor_Entry_Code,
    U.user_id AS HostId,
    (U.User_Name) AS HostName,
    H.imageurl AS imageurl,
    H.visitor_address AS Address,
    H.notification_status As status
FROM android_notification_details H
LEFT JOIN android_users HO 
    ON HO.mobileno COLLATE utf8mb4_general_ci = H.mobile_no COLLATE utf8mb4_general_ci and H.notification_type='2'
LEFT JOIN Users U 
    ON U.User_Tel_No COLLATE utf8mb4_general_ci = H.mobile_no COLLATE utf8mb4_general_ci and H.notification_type='1'
    AND U.user_id = H.visitor_or_host_id
WHERE H.mobile_no = _MobileNo
  AND H.notification_status = 1
ORDER BY H.Visitor_Entry_Date DESC;


    -- OLD NOTIFICATION
    SELECT
    H.notification_id AS NotificationId,
    H.Visitor_Entry_Code AS VisitorEntryCode,
    DATE_FORMAT(H.Visitor_Entry_Date, '%d-%m-%Y %h:%i %p') AS RequestDate,
    HO.user_id AS VisitorId,
    H.notification_message As PurposeOfVisit,
    (HO.user_name) AS VisitorName,
    H.Visitor_Entry_Code,
    U.user_id AS HostId,
    (U.User_Name) AS HostName,
    H.imageurl AS imageurl,
    H.visitor_address AS Address,
    H.notification_status As status
FROM android_notification_details H
LEFT JOIN android_users HO 
    ON HO.mobileno COLLATE utf8mb4_general_ci = H.mobile_no COLLATE utf8mb4_general_ci and H.notification_type='2'
LEFT JOIN Users U 
    ON U.User_Tel_No COLLATE utf8mb4_general_ci = H.mobile_no COLLATE utf8mb4_general_ci and H.notification_type='1'
    AND U.user_id = H.visitor_or_host_id
WHERE H.mobile_no = _MobileNo
  AND H.notification_status = 2
ORDER BY H.Visitor_Entry_Date DESC;


END //

DELIMITER ;
