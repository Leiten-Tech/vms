DELIMITER //
DROP PROCEDURE IF EXISTS SP_WORKFLOW_POPPUP_FETCH;
create procedure SP_WORKFLOW_POPPUP_FETCH
(
	IN UserId bigint,
	IN PlantId bigint,
	IN RoleId bigint,
	IN DocumentCode varchar(100) ,
	IN Type varchar(100) 
)
BEGIN
	if Type = 'PopupFetch'
	THEN
		SELECT 
		a.Plant_Id PlantId,          
		a.Created_By AS RequesterId,          
		ad.Document_Id DocumentId,          
		f.Function_Name FunctionName,            
		ad.Document_No DocumentNo,      
		ad.Level_Id LevelId,          
        a.Approval_Id ApprovalId,
        a.Approval_Activity_Id ApprovalActivityId,
		ad.Approval_Detail_Id ApprovalDetailId,            
		ad.Primary_User_Id PrimaryUserId,            
		ad.Secondary_User_Id SecondaryUserId,            
		IFNULL(U.User_Name,'') AS RequesterName,            
		ad.Created_On CreatedOn
		FROM Approval_Detail ad
		inner join Approval a on a.Approval_Id=ad.Approval_Id
		inner join `function` f on f.Function_Id=ad.Document_Id
		LEFT JOIN USERS U ON U.User_Id =a.Created_By 
		WHERE ad.Is_Viewed=0 and ad.Document_Id <> 40 and
		(ad.Primary_User_Id=UserId or ad.Secondary_User_Id=UserId) and a.Plant_Id=PlantId and ad.Status = 74
        order by ad.Approval_Detail_Id desc
        limit 1;
        
	end if;
    IF Type = 'CheckOutTimer' THEN
		
			CREATE TEMPORARY TABLE Temp_Visitor_Not_Checked_Out AS
			(
				SELECT 
					ve.Visitor_Entry_Code AS VisitorEntryCode,
					vd.First_Name AS VisitorName,
					g.Gate_Name AS GateName,
					p.Plant_Name AS PlantName,
					vd.Mobile_No AS MobileNo,
					vd.Mail_Id AS MailId,
					u.User_Id AS ApproveUserId,
                    ve.Company_Id CompanyId,
					ve.Plant_Id PlantId,
					ve.Gate_Id GateId,
					ve.Visitor_Entry_Id AS VisitorId
				FROM 
					Visitor_Entry ve 
				INNER JOIN 
					Visitor_Entry_Detail vd ON vd.Visitor_Entry_Id = ve.Visitor_Entry_Id
				LEFT JOIN 
					Gate g ON g.Gate_Id = ve.Gate_Id
				INNER JOIN 
					Plant p ON p.Plant_Id = ve.Plant_Id
				INNER JOIN 
					Users u ON u.User_Id = ve.Visited_Employee_Id
				WHERE 
					ve.Status = 75 and p.Check_Token is not null and p.Check_Token != ""
					AND CURDATE() BETWEEN DATE(vd.Valid_From) AND DATE(vd.Valid_To) 
					AND EXISTS (
						SELECT 1 
						FROM Visitor_Entry_Log v 
						WHERE 
							v.Visitor_Entry_Code = ve.Visitor_Entry_Code 
							AND v.Visitor_Entry_Detail_Id = vd.Visitor_Entry_Detail_Id 
							AND v.Checked_In IS NOT NULL 
							AND v.Checked_Out IS NULL 
							AND DATE(v.Created_On) = CURDATE()
					)
					AND TIME(NOW()) > TIME(g.Gate_Close_Time)
				ORDER BY 
					ve.Created_On DESC, ve.Modified_On DESC
			);
            
		INSERT INTO Notification (
			Company_Id,
			Plant_Id,
			Gate_Id,
			Entry_Code,
			Visitor_Id,
			Incharge_Id,
			Visitor_Name,
			Mobile_No,
			Mail_Id,
			Notification_Sent,
			Sent_Timestamp,
			Created_By,
			Created_On,
			Status
		)
		SELECT 
			tv.CompanyId AS Company_Id, 
			tv.PlantId Plant_Id,
			tv.GateId Gate_Id,
			tv.VisitorEntryCode AS Entry_Code,
			tv.VisitorId AS Visitor_Id,
			tv.ApproveUserId AS Incharge_Id,
			tv.VisitorName AS Visitor_Name,
			tv.MobileNo AS Mobile_No,
			tv.MailId AS Mail_Id,
			0 AS Notification_Sent,
			NULL AS Sent_Timestamp,
			NULL AS Created_By,
			NOW() AS Created_On,
			1 AS Status 
		FROM 
			Temp_Visitor_Not_Checked_Out tv
		WHERE 
			NOT EXISTS (
				SELECT 1 
				FROM Notification n 
				WHERE 
					n.Entry_Code = tv.VisitorEntryCode
			);
		
        select 
        n.Notification_Id NotificationId, 
		n.Company_Id CompanyId, 
		n.Plant_Id PlantId, 
        p.Plant_Name PlantName,
		n.Gate_Id GateId, 
        g.Gate_Name GateName,
		n.Entry_Code EntryCode, 
		n.Visitor_Id VisitorId, 
		n.Incharge_Id InchargeId, 
        u.User_Name InchargeName,
        u.User_Email InchargeMail,
        u.User_Tel_No InchargeMobile,
		n.Visitor_Name VisitorName, 
		n.Mobile_No MobileNo,
		n.Mail_Id MailId, 
		n.Notification_Sent NotificationSent, 
		n.Sent_Timestamp SentTimestamp, 
		n.Created_By CreatedBy, 
		n.Created_On CreatedOn, 
		n.Modified_By ModifiedBy, 
		n.Modified_On ModifiedOn, 
		n.Status Status
        from Notification n 
        inner join Users u on u.User_Id = n.Incharge_Id
        INNER JOIN Gate g ON g.Gate_Id = n.Gate_Id
		INNER JOIN Plant p ON p.Plant_Id = n.Plant_Id
        where n.Notification_Sent = 0 and p.Check_Token is not null and p.Check_Token != "";
        DROP TEMPORARY TABLE IF EXISTS Temp_Visitor_Not_Checked_Out;

    end if;
	if Type = 'PopupFetchWp'
	then
		SELECT 
		a.Plant_Id PlantId,          
		a.Created_By AS RequesterId,          
		ad.Document_Id DocumentId,          
		f.Function_Name FunctionName,            
		ad.Document_No DocumentNo,      
		ad.Level_Id LevelId,          
        a.Approval_Activity_Id ApprovalActivityId,
		ad.Approval_Detail_Id ApprovalDetailId,            
		ad.Primary_User_Id PrimaryUserId,            
		ad.Secondary_User_Id SecondaryUserId,            
		IFNULL(U.User_Name,'') AS RequesterName,            
		ad.Created_On CreatedOn
		FROM Approval_Detail ad
		inner join Approval a on a.Approval_Id=ad.Approval_Id and a.Document_No = DocumentCode
		inner join `function` f on f.Function_Id=ad.Document_Id
		LEFT JOIN USERS U ON U.User_Id =a.Created_By 
		WHERE -- ad.Is_Viewed=0 and 
		(ad.Primary_User_Id=UserId or ad.Secondary_User_Id=UserId) and a.Plant_Id=PlantId and ad.Status = 74 
        order by ad.Approval_Detail_Id desc
        limit 1;
	end if;
END //

DELIMITER ;