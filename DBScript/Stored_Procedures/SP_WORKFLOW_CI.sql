DELIMITER //
DROP PROCEDURE IF EXISTS SP_WORKFLOW_CI;

CREATE PROCEDURE SP_WORKFLOW_CI(
    IN Type VARCHAR(255),
    IN WorkFlowId BIGINT,
    IN PlantId BIGINT,
    IN UserId BIGINT,
    IN Status INT
)
BEGIN       
	-- Showing count
	DECLARE approved INT;
	DECLARE pending INT;
	DECLARE rejected INT;
        
    IF Type = 'SearchInitialize' THEN
        -- For Whom to Visit Type of Approval
        DROP TEMPORARY TABLE IF EXISTS workflowTemp;
        CREATE TEMPORARY TABLE workflowTemp AS
        SELECT
			ad.Approval_Detail_Id AS ApprovalDetailId,
              Ac.Approval_Activity_Id As ApprovalActivityId,
           --  Ac.Document_Id as DocumentDetailId,
			ad.Approval_Id AS ApprovalId,
			a.Plant_Id AS PlantId,
			p.Plant_Name AS PlantName,
			ad.Document_Id AS DocumentId,
			f.Function_Name AS DocumentType,
			f.Function_Url AS DocumentUrl,
			ad.Document_No AS DocumentNo,
			ad.Level_Id AS LevelId,
			m.Meta_Sub_Description AS Stages,
			ad.Primary_User_Id AS PrimaryUserId,
			ad.Secondary_User_Id AS SecondaryUserId,
			u.User_Name AS ApproverName,
			ad.Status AS Status,
			m1.Meta_Sub_Description AS StatusName,
			ad.Remarks1 AS Remarks1,
			ad.Remarks2 AS Remarks2,
			ad.Created_By AS initiatedBy,
			ui.User_Name AS initiatedByName,
			DATE_FORMAT(ad.Created_On, '%Y-%m-%d %H:%i:%s') AS CreatedOn,
			ad.Modified_By AS ModifiedBy,
			ad.Modified_On AS ModifiedOn
		FROM Approval_Detail ad
		INNER JOIN Approval a ON a.Approval_Id = ad.Approval_Id
        INNER JOIN Approval_Configuration ac on ac.Plant_Id = a.Plant_Id AND ac.Document_Id = ad.Document_Id 
		INNER JOIN `function` f ON f.Function_Id = ad.Document_Id AND a.Document_Id NOT IN (41, 42)
		INNER JOIN Metadata m ON m.Meta_Sub_Id = ad.Level_Id
		INNER JOIN Metadata m1 ON m1.Meta_Sub_Id = ad.Status
		INNER JOIN Users u ON u.User_Id = UserId
		LEFT JOIN Users ui ON ui.User_Id = ad.Created_By
		INNER JOIN Plant p ON p.Plant_Id = a.Plant_Id
		LEFT JOIN visitor_entry ve ON ve.visitor_entry_code = a.Document_No
		LEFT JOIN users u2 ON u2.User_id = ve.Visited_Employee_Id
		WHERE
			a.Plant_Id = PlantId AND 
			(
				ad.Primary_User_Id = UserId 
				OR ad.Secondary_User_Id = UserId
				OR (
					(ad.Primary_User_Id = 0)
					AND u2.User_id = UserId
				)
			)
			AND p.Check_Token IS NOT NULL 
			AND p.Check_Token != ""
		ORDER BY COALESCE(ad.Modified_On, ad.Created_On) DESC;


        IF Status IN (75, 76, 74) THEN
            SELECT * FROM workflowTemp WHERE Status = Status;
        ELSE
            SELECT * FROM workflowTemp;
        END IF;

        SELECT COUNT(*) INTO approved
        FROM Approval_Detail ad
        INNER JOIN Approval a ON a.Approval_Id = ad.Approval_Id AND a.Document_Id <> 40
        INNER JOIN Users u ON u.User_Id = UserId
        INNER JOIN Users ui ON ui.User_Id = a.Created_By
        INNER JOIN Plant p ON p.Plant_Id = a.Plant_Id
        WHERE a.Plant_Id = PlantId AND (ad.Primary_User_Id = UserId OR ad.Secondary_User_Id = UserId) AND a.Status = 75 and p.Check_Token is not null and p.Check_Token != "";

        SELECT COUNT(*) INTO pending
        FROM Approval_Detail ad
        INNER JOIN Approval a ON a.Approval_Id = ad.Approval_Id AND a.Document_Id <> 40
        INNER JOIN Users u ON u.User_Id = UserId
        INNER JOIN Users ui ON ui.User_Id = a.Created_By
        INNER JOIN Plant p ON p.Plant_Id = a.Plant_Id
        WHERE a.Plant_Id = PlantId AND (ad.Primary_User_Id = UserId OR ad.Secondary_User_Id = UserId) AND a.Status = 74 and p.Check_Token is not null and p.Check_Token != "";

        SELECT COUNT(*) INTO rejected
        FROM Approval_Detail ad
        INNER JOIN Approval a ON a.Approval_Id = ad.Approval_Id AND a.Document_Id <> 40
        INNER JOIN Users u ON u.User_Id = UserId
        INNER JOIN Users ui ON ui.User_Id = a.Created_By
        INNER JOIN Plant p ON p.Plant_Id = a.Plant_Id
        WHERE a.Plant_Id = PlantId AND (ad.Primary_User_Id = UserId OR ad.Secondary_User_Id = UserId) AND a.Status = 76 and p.Check_Token is not null and p.Check_Token != "";

        SELECT approved, pending, rejected;
    END IF;
END //
DELIMITER ;
