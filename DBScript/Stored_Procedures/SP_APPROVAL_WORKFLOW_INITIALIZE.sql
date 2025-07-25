DELIMITER //
DROP PROCEDURE IF EXISTS SP_APPROVAL_WORKFLOW_INITIALIZE;

CREATE PROCEDURE SP_APPROVAL_WORKFLOW_INITIALIZE (
    IN companyid BIGINT,
    IN plantid BIGINT,
    IN requesterid BIGINT,
    IN documentno VARCHAR(255),
    IN documentid INT,
    IN documentactivityid BIGINT,
    IN documentdetailid BIGINT,
    IN status INT,
    IN approverid BIGINT,
    IN levelid INT,
    IN alternateuser BIGINT,
    IN remarks1 VARCHAR(255),
    IN remarks2 VARCHAR(255),
    IN parentid VARCHAR(255),
    IN userid BIGINT,
    IN requestfromdate DATETIME,
    IN requesttodate DATETIME
)
BEGIN
    DECLARE RequestPlantId INT;
    DECLARE LevelId INT;
	DECLARE WORKFLOW INT;
    DECLARE WORKFLOWSTAGE INT;
    DECLARE RequestDeptId BIGINT;


    SET RequestPlantId = plantid;
    
    SET RequestDeptId = (
		SELECT Dept_Id FROM Users WHERE User_Id = userid LIMIT 1
	);
        
	SET LevelId = (
        SELECT COALESCE(MIN(ad.Level_Id), 0) FROM Approval_Configuration_Details ad 
        INNER JOIN Approval_Configuration a ON a.Approval_Configuration_Id = ad.Approval_Configuration_Id AND a.Plant_Id = RequestPlantId
        WHERE a.Document_Id = documentid AND a.Approval_Activity_Id = documentactivityid AND a.Status = 1 -- AND ad.Department_Id = RequestDeptId
	);
 
    SET WORKFLOW = (
        SELECT COUNT(1) FROM Approval_Configuration_Details DTB   
        INNER JOIN Approval_Configuration DS ON DS.Approval_Configuration_Id = DTB.Approval_Configuration_Id  
        WHERE DS.Document_Id = documentid AND DTB.Level_Id = LevelId AND DS.Approval_Activity_Id = documentactivityid AND DS.Plant_Id = RequestPlantId
       -- AND DTB.Department_Id = RequestDeptId
        AND DS.Status = 1
    );

    IF WORKFLOW = 0 THEN
        SET plantid = 1;
    END IF;
    
    SET WORKFLOWSTAGE = (
        SELECT COUNT(1) FROM Approval_Configuration_Details DTB     
        INNER JOIN Approval_Configuration DS ON DS.Approval_Configuration_Id = DTB.Approval_Configuration_Id    
        WHERE DS.Document_Id = documentid AND DS.Approval_Activity_Id = documentactivityid AND DTB.Level_Id = levelid AND DS.Plant_Id = RequestPlantId  
        AND DS.Status = 1 
        -- AND DTB.Department_Id = RequestDeptId 
        AND DTB.Primary_User_Id IS NOT NULL
    );

    IF documentid != 0 and WORKFLOW != 0 THEN
        INSERT INTO Approval (
            Document_Id,
            Document_No,
            Plant_Id,
            Status,
            Created_By,
            Created_On,
            Approval_Activity_Id
        ) VALUES (
            documentid,
            documentno,
            RequestPlantId,
            74,
            userid,
            NOW(),
            documentactivityid
        );

        -- CALL SP_APPROVAL_WORKFLOW_TRANSACTION(companyid, RequestPlantId, documentid, documentno, 74, approverid, documentdetailid, userid);
		
        IF WORKFLOWSTAGE != 0 THEN
            INSERT INTO Approval_Detail (
                Approval_Id,
                Document_Id,
                Document_No,
                Level_Id,
                Primary_User_Id,
                Secondary_User_Id,
                Status,
                Remarks1,
                Remarks2,
                Created_By,
                Created_On,
                Is_Viewed
            )
            SELECT
                a.Approval_Id,
                a.Document_Id,
                a.Document_No,
                LevelId,
                acd.Primary_User_Id,
                acd.Secondary_User_Id,
                74,
                remarks1,
                remarks2,
                userid,
                NOW(),
                0
            FROM
                Approval a
            INNER JOIN
                Approval_Configuration ac ON ac.Document_Id = a.Document_Id AND ac.Plant_Id = RequestPlantId
            INNER JOIN
                Approval_Configuration_Details acd ON acd.Approval_Configuration_Id = ac.Approval_Configuration_Id 
				AND acd.Level_Id = LevelId -- AND acd.Department_Id = RequestDeptId
            WHERE
                a.Document_Id = documentid AND a.Document_No = documentno AND a.Approval_Activity_Id = documentactivityid
            
			GROUP BY
			a.Approval_Id,
			a.Document_Id,
			a.Document_No,
			a.Approval_Activity_Id,
			acd.Primary_User_Id,
			acd.Secondary_User_Id;
        ELSE
            UPDATE Approval SET Status = 75
            WHERE Document_Id = documentid AND Document_No = documentno AND Plant_Id = RequestPlantId AND Status = 74;
             
            
            CALL SP_APPROVAL_WORKFLOW_TRANSACTION(companyid, RequestPlantId, documentid, documentno, 75, approverid, documentdetailid, userid);
            
            SELECT '001' AS ERRORNO, 'Approval Levels Not Defined for the current document.' AS ERRORMESSAGE;
        END IF;
	ELSE
        SELECT '001' AS ERRORNO, 'Approval Not Configured for the current document.' AS ERRORMESSAGE;
    END IF;
END//
DELIMITER ;
