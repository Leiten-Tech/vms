DROP PROCEDURE IF EXISTS SP_ANDROID_HOME_PAGE;
DELIMITER //
CREATE PROCEDURE SP_ANDROID_HOME_PAGE
(
    IN _Mobileno VARCHAR(15)
)
BEGIN
    -- DASHBOARD INFORMATION
    DROP TEMPORARY TABLE IF EXISTS TEMPDASHBOARD;
    
    CREATE TEMPORARY TABLE TEMPDASHBOARD
    (
      TOTALVISITORSCOUNT INT,
      TOTALAPPROVEDCOUNT INT,
      TOTALREJECTEDCOUNT INT,
      TODAYSMEETINGCOUNT INT,
      TOTALNOTIFICATIONCOUNT INT,
      TOTALCHECKINCOUNT INT,
      TOTALCHECKOUTCOUNT INT,
      TOTALVISITORREQUESTCOUNT INT,
      TOTALVISITORAPPROVEDCOUNT INT,
	  TOTALVISITORREJECTEDCOUNT INT,
	  TOTALVISITORCHECKINCOUNT INT,
      TOTALVISITORCHECKOUTCOUNT INT
    );
    -- Insert initial values
    INSERT INTO TEMPDASHBOARD
    (
		TOTALVISITORSCOUNT, 
		TOTALAPPROVEDCOUNT,
		TOTALREJECTEDCOUNT, 
		TODAYSMEETINGCOUNT, 
		TOTALNOTIFICATIONCOUNT, 
		TOTALCHECKINCOUNT,
		TOTALCHECKOUTCOUNT,
        TOTALVISITORREQUESTCOUNT,
        TOTALVISITORAPPROVEDCOUNT,
        TOTALVISITORREJECTEDCOUNT,
        TOTALVISITORCHECKINCOUNT,
        TOTALVISITORCHECKOUTCOUNT
    )
    VALUES (0, 0, 0, 0, 0, 0, 0,0,0,0,0,0);

    -- NOTIFICATION COUNT
    UPDATE TEMPDASHBOARD
    LEFT JOIN (
        SELECT COUNT(*) AS NOTIFICATIONCOUNT
        FROM android_notification_details n 
        WHERE n.notification_status = 1 AND n.mobile_no = _Mobileno
    ) A ON TRUE
    SET TEMPDASHBOARD.TOTALNOTIFICATIONCOUNT = A.NOTIFICATIONCOUNT;

    -- TOTAL VISITORS (HOST)
    UPDATE TEMPDASHBOARD
    LEFT JOIN (
        SELECT COUNT(*) AS TOTALVISITORSCOUNT
        FROM visitor_entry H 
        INNER JOIN android_users A ON A.user_id = H.Visitor_Id AND H.is_android_visitor = 1
        INNER JOIN users HO ON HO.User_Id = H.Visited_Employee_Id 
        AND HO.User_Tel_No COLLATE utf8mb4_general_ci = _Mobileno
        INNER JOIN company C ON C.Company_Id = HO.Company_Id
        INNER JOIN plant PL ON PL.Company_Id = C.Company_Id AND PL.Plant_Id = H.Plant_Id
        INNER JOIN metadata MT ON MT.Meta_Sub_Id = H.Purpose_Of_Visit AND H.status=75 and DATE(H.Visitor_Entry_Date)= DATE(CURDATE())
    ) A ON TRUE
    SET TEMPDASHBOARD.TOTALVISITORSCOUNT = A.TOTALVISITORSCOUNT;

    -- APPROVED VISITORS (HOST)
    UPDATE TEMPDASHBOARD
    LEFT JOIN (
        SELECT COUNT(*) AS TOTALAPPROVEDCOUNT
        FROM visitor_entry H 
        INNER JOIN android_users A ON A.user_id = H.Visitor_Id AND H.is_android_visitor = 1 AND H.Status = 75 and DATE(H.Visitor_Entry_Date)= DATE(CURDATE())
        INNER JOIN users HO ON HO.User_Id = H.Visited_Employee_Id 
        AND HO.User_Tel_No COLLATE utf8mb4_general_ci = _Mobileno
        INNER JOIN company C ON C.Company_Id = HO.Company_Id
        INNER JOIN plant PL ON PL.Company_Id = C.Company_Id AND PL.Plant_Id = H.Plant_Id
        INNER JOIN metadata MT ON MT.Meta_Sub_Id = H.Purpose_Of_Visit
    ) A ON TRUE
    SET TEMPDASHBOARD.TOTALAPPROVEDCOUNT = A.TOTALAPPROVEDCOUNT;

    -- REJECTED VISITORS (HOST)
    UPDATE TEMPDASHBOARD
    LEFT JOIN (
        SELECT COUNT(*) AS TOTALREJECTEDCOUNT
        FROM visitor_entry H 
        INNER JOIN android_users A ON A.user_id = H.Visitor_Id AND H.is_android_visitor = 1 AND H.Status = 76 and DATE(H.Visitor_Entry_Date)= DATE(CURDATE())
        INNER JOIN users HO ON HO.User_Id = H.Visited_Employee_Id 
        AND HO.User_Tel_No COLLATE utf8mb4_general_ci = _Mobileno
        INNER JOIN company C ON C.Company_Id = HO.Company_Id
        INNER JOIN plant PL ON PL.Company_Id = C.Company_Id AND PL.Plant_Id = H.Plant_Id
        INNER JOIN metadata MT ON MT.Meta_Sub_Id = H.Purpose_Of_Visit
    ) A ON TRUE
    SET TEMPDASHBOARD.TOTALREJECTEDCOUNT = A.TOTALREJECTEDCOUNT;

    -- TODAY'S MEETING (HOST)
    UPDATE TEMPDASHBOARD
    LEFT JOIN (
        SELECT COUNT(*) AS TODAYSMEETINGCOUNT
        FROM visitor_entry H 
        INNER JOIN android_users A ON A.user_id = H.Visitor_Id AND H.is_android_visitor = 1 AND H.Status = 75
        INNER JOIN users HO ON HO.User_Id = H.Visited_Employee_Id 
        AND HO.User_Tel_No COLLATE utf8mb4_general_ci = _Mobileno 
        AND DATE(H.Visitor_Entry_Date)= DATE(CURDATE())
        INNER JOIN company C ON C.Company_Id = HO.Company_Id
        INNER JOIN plant PL ON PL.Company_Id = C.Company_Id AND PL.Plant_Id = H.Plant_Id
        INNER JOIN metadata MT ON MT.Meta_Sub_Id = H.Purpose_Of_Visit
    ) A ON TRUE
    SET TEMPDASHBOARD.TODAYSMEETINGCOUNT = A.TODAYSMEETINGCOUNT;
    
    -- TOTALCHECKINCOUNT (HOST)
    UPDATE TEMPDASHBOARD
    LEFT JOIN (
        SELECT COUNT(*) AS TOTALCHECKINCOUNT
        FROM visitor_entry H 
        INNER JOIN android_users A ON A.user_id = H.Visitor_Id AND H.is_android_visitor = 1 AND H.Status = 75 and DATE(H.Visitor_Entry_Date)= DATE(CURDATE())
        INNER JOIN users HO ON HO.User_Id = H.Visited_Employee_Id 
        AND HO.User_Tel_No COLLATE utf8mb4_general_ci = _Mobileno
        INNER JOIN company C ON C.Company_Id = HO.Company_Id
        INNER JOIN plant PL ON PL.Company_Id = C.Company_Id AND PL.Plant_Id = H.Plant_Id
        INNER JOIN metadata MT ON MT.Meta_Sub_Id = H.Purpose_Of_Visit
        INNER JOIN visitor_entry_log VE ON VE.Visitor_Entry_Code = H.Visitor_Entry_Code AND VE.Checked_In IS NOT NULL
    ) A ON TRUE
    SET TEMPDASHBOARD.TOTALCHECKINCOUNT = A.TOTALCHECKINCOUNT;
    
    -- TOTALCHECKOUTCOUNT (HOST)
    UPDATE TEMPDASHBOARD
    LEFT JOIN (
        SELECT COUNT(*) AS TOTALCHECKOUTCOUNT
        FROM visitor_entry H 
        INNER JOIN android_users A ON A.user_id = H.Visitor_Id AND H.is_android_visitor = 1 AND H.Status = 75 and DATE(H.Visitor_Entry_Date)= DATE(CURDATE())
        INNER JOIN users HO ON HO.User_Id = H.Visited_Employee_Id 
        AND HO.User_Tel_No COLLATE utf8mb4_general_ci = _Mobileno
        INNER JOIN company C ON C.Company_Id = HO.Company_Id
        INNER JOIN plant PL ON PL.Company_Id = C.Company_Id AND PL.Plant_Id = H.Plant_Id
        INNER JOIN metadata MT ON MT.Meta_Sub_Id = H.Purpose_Of_Visit
        INNER JOIN visitor_entry_log VE ON VE.Visitor_Entry_Code = H.Visitor_Entry_Code AND VE.Checked_Out IS NOT NULL
    ) A ON TRUE
    SET TEMPDASHBOARD.TOTALCHECKOUTCOUNT = A.TOTALCHECKOUTCOUNT;
    
    -- TOTALVISITORREQUESTCOUNT (VISITOR)
    UPDATE TEMPDASHBOARD
    LEFT JOIN (
        SELECT COUNT(*) AS TOTALVISITORREQUESTCOUNT
        FROM visitor_entry H 
        INNER JOIN android_users A ON A.user_id = H.Visitor_Id AND H.is_android_visitor = 1 AND A.mobileno COLLATE utf8mb4_general_ci = _Mobileno
        INNER JOIN users HO ON HO.User_Id = H.Visited_Employee_Id 
        INNER JOIN company C ON C.Company_Id = HO.Company_Id
        INNER JOIN plant PL ON PL.Company_Id = C.Company_Id AND PL.Plant_Id = H.Plant_Id
        INNER JOIN metadata MT ON MT.Meta_Sub_Id = H.Purpose_Of_Visit AND H.status=74 and DATE(H.Visitor_Entry_Date)= DATE(CURDATE())
    ) A ON TRUE
    SET TEMPDASHBOARD.TOTALVISITORREQUESTCOUNT = A.TOTALVISITORREQUESTCOUNT;
    
     -- TOTALVISITORAPPROVEDCOUNT (VISITOR)
    UPDATE TEMPDASHBOARD
    LEFT JOIN (
        SELECT COUNT(*) AS TOTALVISITORAPPROVEDCOUNT
        FROM visitor_entry H 
        INNER JOIN android_users A ON A.user_id = H.Visitor_Id AND H.is_android_visitor = 1 
        AND H.Status = 75 and DATE(H.Visitor_Entry_Date)= DATE(CURDATE()) AND  A.mobileno COLLATE utf8mb4_general_ci = _Mobileno
        INNER JOIN users HO ON HO.User_Id = H.Visited_Employee_Id 
        INNER JOIN company C ON C.Company_Id = HO.Company_Id
        INNER JOIN plant PL ON PL.Company_Id = C.Company_Id AND PL.Plant_Id = H.Plant_Id
        INNER JOIN metadata MT ON MT.Meta_Sub_Id = H.Purpose_Of_Visit
    ) A ON TRUE
    SET TEMPDASHBOARD.TOTALVISITORAPPROVEDCOUNT = A.TOTALVISITORAPPROVEDCOUNT;
    
     -- TOTALVISITORREJECTEDCOUNT (VISITOR)
    UPDATE TEMPDASHBOARD
    LEFT JOIN (
        SELECT COUNT(*) AS TOTALVISITORREJECTEDCOUNT
        FROM visitor_entry H 
        INNER JOIN android_users A ON A.user_id = H.Visitor_Id AND H.is_android_visitor = 1 
        AND H.Status = 76 and DATE(H.Visitor_Entry_Date)= DATE(CURDATE()) AND A.mobileno COLLATE utf8mb4_general_ci = _Mobileno
        INNER JOIN users HO ON HO.User_Id = H.Visited_Employee_Id 
        INNER JOIN company C ON C.Company_Id = HO.Company_Id
        INNER JOIN plant PL ON PL.Company_Id = C.Company_Id AND PL.Plant_Id = H.Plant_Id
        INNER JOIN metadata MT ON MT.Meta_Sub_Id = H.Purpose_Of_Visit
    ) A ON TRUE
    SET TEMPDASHBOARD.TOTALVISITORREJECTEDCOUNT = A.TOTALVISITORREJECTEDCOUNT;
    
      -- TOTALVISITORCHECKINCOUNT (VISITOR)
    UPDATE TEMPDASHBOARD
    LEFT JOIN (
        SELECT COUNT(*) AS TOTALVISITORCHECKINCOUNT
        FROM visitor_entry H 
        INNER JOIN android_users A ON A.user_id = H.Visitor_Id AND H.is_android_visitor = 1 
        AND H.Status = 75 and DATE(H.Visitor_Entry_Date)= DATE(CURDATE()) AND A.mobileno COLLATE utf8mb4_general_ci = _Mobileno
        INNER JOIN users HO ON HO.User_Id = H.Visited_Employee_Id 
        INNER JOIN company C ON C.Company_Id = HO.Company_Id
        INNER JOIN plant PL ON PL.Company_Id = C.Company_Id AND PL.Plant_Id = H.Plant_Id
        INNER JOIN metadata MT ON MT.Meta_Sub_Id = H.Purpose_Of_Visit
        INNER JOIN visitor_entry_log VE ON VE.Visitor_Entry_Code = H.Visitor_Entry_Code AND VE.Checked_In IS NOT NULL
    ) A ON TRUE
    SET TEMPDASHBOARD.TOTALVISITORCHECKINCOUNT = A.TOTALVISITORCHECKINCOUNT;
    
    -- TOTALVISITORCHECKOUTCOUNT (VISITOR)
    UPDATE TEMPDASHBOARD
    LEFT JOIN (
        SELECT COUNT(*) AS TOTALVISITORCHECKOUTCOUNT
        FROM visitor_entry H 
        INNER JOIN android_users A ON A.user_id = H.Visitor_Id AND H.is_android_visitor = 1 
        AND H.Status = 75 and DATE(H.Visitor_Entry_Date)= DATE(CURDATE()) AND A.mobileno COLLATE utf8mb4_general_ci = _Mobileno
        INNER JOIN users HO ON HO.User_Id = H.Visited_Employee_Id 
        INNER JOIN company C ON C.Company_Id = HO.Company_Id
        INNER JOIN plant PL ON PL.Company_Id = C.Company_Id AND PL.Plant_Id = H.Plant_Id
        INNER JOIN metadata MT ON MT.Meta_Sub_Id = H.Purpose_Of_Visit
        INNER JOIN visitor_entry_log VE ON VE.Visitor_Entry_Code = H.Visitor_Entry_Code AND VE.Checked_Out IS NOT NULL
    ) A ON TRUE
    SET TEMPDASHBOARD.TOTALVISITORCHECKOUTCOUNT = A.TOTALVISITORCHECKOUTCOUNT;

    -- Select result
    SELECT * FROM TEMPDASHBOARD;

END //
DELIMITER ;
