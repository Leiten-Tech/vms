DELIMITER //
DROP PROCEDURE IF EXISTS SP_ANDROID_APPROVAL_WORKFLOW_UPDATE;

CREATE PROCEDURE SP_ANDROID_APPROVAL_WORKFLOW_UPDATE (
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
    IN requesttodate DATETIME,
    IN isviewed BOOLEAN
)
BEGIN
    DECLARE NEXTSTAGE INT DEFAULT 0;
    DECLARE WORKFLOW INT DEFAULT 0;
    DECLARE NEXTSTAGECOUNT INT DEFAULT 0;
    DECLARE conditionExists INT DEFAULT 0;
    DECLARE CURRLVLSTS INT DEFAULT 75;

    -- Check if specific conditions are met in Approval table
    SELECT COUNT(*)
    INTO conditionExists 
    FROM Approval a
    WHERE a.Status = 75
      AND a.Document_Id = documentid
      AND a.Document_No = documentno
      AND a.Approval_Activity_Id = documentactivityid
      AND documentactivityid = 70;

    SELECT a.Status
    INTO CURRLVLSTS 
    FROM Approval_Detail a
    WHERE a.Level_Id = levelid
      AND a.Document_No = documentno
       AND a.Status = 74
    ORDER BY IFNULL(a.Modified_On, a.Created_On) DESC
    LIMIT 1;

	
	SELECT conditionExists;
	SELECT CURRLVLSTS;
    -- Convert the condition flag to BOOLEAN
    SET conditionExists = IF(conditionExists = 1, TRUE, FALSE);


    IF conditionExists THEN
        SELECT '';  
    ELSEIF CURRLVLSTS = 74 THEN
   
        SELECT COALESCE(MIN(Level_Id), 0) 
        INTO NEXTSTAGE 
        FROM Approval_Configuration_Details DTB
        INNER JOIN Approval_Configuration DS 
            ON DS.Approval_Configuration_Id = DTB.Approval_Configuration_Id 
           AND DS.Approval_Activity_Id = documentactivityid 
           AND DS.Plant_Id = plantid
        WHERE DS.Document_Id = documentid 
          AND DTB.Level_Id > levelid;

        -- Check if Workflow is defined at this level
        SELECT COUNT(1)
        INTO WORKFLOW 
        FROM Approval_Configuration_Details DTB
        INNER JOIN Approval_Configuration DS 
            ON DS.Approval_Configuration_Id = DTB.Approval_Configuration_Id 
           AND DS.Approval_Activity_Id = documentactivityid
        WHERE DS.Document_Id = documentid
          AND DTB.Level_Id = levelid
          AND DS.Plant_Id = plantid
          AND DS.Status = 1;

        IF WORKFLOW = 0 THEN
            SET plantid = 1;
        END IF;

        -- Check count of next stages with defined Primary Users
        SELECT COUNT(1)
        INTO NEXTSTAGECOUNT 
        FROM Approval_Configuration_Details DTB
        INNER JOIN Approval_Configuration DS 
            ON DS.Approval_Configuration_Id = DTB.Approval_Configuration_Id 
           AND DS.Approval_Activity_Id = documentactivityid
        INNER JOIN Approval_Detail ap 
            ON ap.Document_Id = DS.Document_Id 
           AND ap.Level_Id = DTB.Level_Id
        WHERE DS.Document_Id = documentid
          AND DTB.Level_Id <= NEXTSTAGE
          AND DS.Plant_Id = plantid
          AND DS.Status = 1
          AND DTB.Primary_User_Id IS NOT NULL
          AND ap.Document_No = documentno;

        -- Update Approval_Detail and Approval tables
        UPDATE Approval_Detail AS WFD
        INNER JOIN Approval_Detail AS WFH 
            ON WFH.Approval_Id = WFD.Approval_Id 
        SET WFD.Remarks1 = remarks1,
            WFD.Status = status,
            WFD.Modified_By = approverid,
            WFD.Modified_On = NOW(),
            WFD.Is_Viewed = isviewed
        WHERE WFH.Document_No = documentno
          AND WFD.Level_Id = levelid;

        -- Select relevant Approval_Detail data for output
        SELECT a.Approval_Detail_Id ApprovalDetailId,
               a.Approval_Id ApprovalId,
               a.Document_Id DocumentId,
               a.Document_No DocumentNo,
               a.Level_Id LevelId,
               a.Primary_User_Id PrimaryUserId,
               a.Secondary_User_Id SecondaryUserId,
               a.Is_Viewed IsViewed,
               a.Status Status,
               a.Remarks1 Remarks1,
               a.Remarks2 Remarks2,
               a.Created_By CreatedBy,
               a.Created_On CreatedOn,
               a.Modified_By ModifiedBy,
               a.Modified_On ModifiedOn
        FROM Approval_Detail a
        WHERE a.Document_No = documentno;

		SELECT status;
		SELECT NEXTSTAGECOUNT;
        
        IF status != 76 THEN
			-- Update Work Permit Detail with User Digital Signature
            if documentid = 42 then
				UPDATE wp_approval_detail AS wpad
				INNER JOIN Users u 
					ON u.User_Id = approverid
				INNER JOIN Work_Permit wp 
					ON wp.Work_Permit_Code = documentno 
				INNER JOIN Approval WFH on WFH.Document_No = documentno
				INNER JOIN Approval_Detail WFD ON WFD.Approval_Id = WFH.Approval_Id
				LEFT join Approval_Configuration ac on ac.Document_Id=WFH.Document_Id and ac.Approval_Activity_Id=documentactivityid and ac.Plant_Id=plantid
				LEFT JOIN Approval_Configuration_Details DTS ON DTS.Approval_Configuration_Id=ac.Approval_Configuration_Id AND DTS.Level_Id=WFD.Level_Id
				SET wpad.Remarks1 = remarks1,
					wpad.Digital_Sign = u.Digital_Sign,
					wpad.Digital_Sign_Url = u.Digital_Sign_Name,
					wpad.Modified_On = NOW(),
					wpad.Modified_By = approverid,
					wpad.Status = 75,
                    wpad.Level_Id = levelid
				WHERE wp.Work_Permit_Id = wpad.Work_Permit_Id
				  AND (wpad.Primary_User_Id or wpad.Secondary_User_Id = approverid) ;-- and wpad.Level_Id = levelid;
              end if;
              
            IF NEXTSTAGECOUNT != 0 THEN
                -- Insert into Approval_Detail for next stage
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
                SELECT Approval_Id,
                       documentid,
                       documentno,
                       NEXTSTAGE,
                       dws.Primary_User_Id,
                       dws.Secondary_User_Id,
                       74,
                       '',
                       '',
                       l.Created_By,
                       NOW(),
                       0
                FROM Approval l                          
                INNER JOIN Approval_Configuration ac 
                    ON ac.Document_Id = l.Document_Id 
                   AND ac.Approval_Activity_Id = documentactivityid 
                   AND ac.Plant_Id = plantid
                INNER JOIN Approval_Configuration_Details DWS 
                    ON DWS.Approval_Configuration_Id = ac.Approval_Configuration_Id
                WHERE DWS.Level_Id = NEXTSTAGE 
                  AND ac.Document_Id = documentid 
                  AND ac.Status = 1
                  AND l.Document_No = documentno 
                  AND l.Status NOT IN (75, 76) 
                  AND l.Approval_Activity_Id = documentactivityid;

                -- Update Approval status to 74 for next stage
                UPDATE Approval WFH 
                SET Status = 74,
                    MODIFIED_BY = approverid,
                    MODIFIED_ON = NOW()
                WHERE EXISTS (
                    SELECT 1
                    FROM Approval_Detail WFD
                    INNER JOIN Approval_Configuration ac 
                        ON ac.Document_Id = WFD.Document_Id 
                       AND ac.Approval_Activity_Id = documentactivityid
                       AND ac.Plant_Id = plantid
                    INNER JOIN Approval_Configuration_Details DTS 
                        ON DTS.Approval_Configuration_Id = ac.Approval_Configuration_Id
                       AND DTS.Level_Id = WFD.Level_Id
                    WHERE WFH.Approval_Id = WFD.Approval_Id
                      AND WFH.Document_No = documentno
                      AND DTS.Level_Id = levelid
                );
                
					SELECT 
					a.Approval_Id ApprovalId,
					a.Plant_Id PlantId,
					a.Document_Id DocumentId,
					a.Document_No DocumentNo,
					a.Status Status,
					a.Created_By CreatedBy,
					a.Created_On CreatedOn,
					a.Modified_By ModifiedBy,
					a.Modified_On ModifiedOn,
					a.Approval_Activity_Id ApprovalActivityId
				FROM
					Approval a
				WHERE
					a.Document_No = documentno;
							
						SELECT 
					a.Approval_Detail_Id ApprovalDetailId,
					a.Approval_Id ApprovalId,
					a.Document_Id DocumentId,
					a.Document_No DocumentNo,
					a.Level_Id LevelId,
					a.Primary_User_Id PrimaryUserId,
					a.Secondary_User_Id SecondaryUserId,
					a.Is_Viewed IsViewed,
					a.Status Status,
					a.Remarks1 Remarks1,
					a.Remarks2 Remarks2,
					a.Created_By CreatedBy,
					a.Created_On CreatedOn,
					a.Modified_By ModifiedBy,
					a.Modified_On ModifiedOn
				FROM
					Approval_Detail a
				WHERE
					a.Document_No = documentno
						AND a.Level_Id = levelid;
                    
					SELECT 
					a.Approval_Detail_Id ApprovalDetailId,
					a.Approval_Id ApprovalId,
					a.Document_Id DocumentId,
					a.Document_No DocumentNo,
					a.Level_Id LevelId,
					a.Primary_User_Id PrimaryUserId,
					a.Secondary_User_Id SecondaryUserId,
					a.Is_Viewed IsViewed,
					a.Status Status,
					a.Remarks1 Remarks1,
					a.Remarks2 Remarks2,
					a.Created_By CreatedBy,
					a.Created_On CreatedOn,
					a.Modified_By ModifiedBy,
					a.Modified_On ModifiedOn
				FROM
					Approval_Detail a
				WHERE
					a.Document_No = documentno
				ORDER BY a.Created_On DESC
				LIMIT 1;

            ELSE
                -- Update Approval status to 75 (end state)
                UPDATE Approval WFH
                SET WFH.Status = 75,
                    WFH.MODIFIED_BY = approverid,
                    WFH.MODIFIED_ON = NOW()
                WHERE EXISTS (
                    SELECT 1
                    FROM Approval_Detail WFD
                    LEFT JOIN Approval_Configuration ac 
                        ON ac.Document_Id = WFD.Document_Id 
                       AND ac.Approval_Activity_Id = documentactivityid
                       AND ac.Plant_Id = plantid
                    LEFT JOIN Approval_Configuration_Details DTS 
                        ON DTS.Approval_Configuration_Id = ac.Approval_Configuration_Id
                       AND DTS.Level_Id = WFD.Level_Id
                    WHERE WFH.Approval_Id = WFD.Approval_Id
                      AND WFH.Document_No = documentno
                      AND WFD.Level_Id = levelid 
                      AND WFH.Approval_Activity_Id = documentactivityid
                )
                ORDER BY WFH.Approval_Id DESC LIMIT 1;

                -- Call Transaction SP for final approval state
                CALL SP_APPROVAL_WORKFLOW_TRANSACTION(companyid, plantid, documentid, documentno, status, approverid, documentdetailid, userid);
                
                UPDATE Approval_Detail WFD 
				SET 
					WFD.Remarks1 = remarks1,
					WFD.Status = status,
					WFD.Modified_By = approverid,
					WFD.Modified_On = NOW(),
					WFD.Is_Viewed = isviewed
				WHERE
					EXISTS( SELECT 
							1
						FROM
							Approval WFH
						WHERE
							WFD.Approval_Id = WFH.Approval_Id
								AND WFH.Document_No = documentno
								AND WFH.Plant_Id = plantid
								AND WFD.Document_Id = documentid
								AND WFD.Level_Id = levelid) ORDER BY WFD.Approval_Detail_Id DESC LIMIT 1;
								
								SELECT 
								a.Approval_Id ApprovalId,
								a.Plant_Id PlantId,
								a.Document_Id DocumentId,
								a.Document_No DocumentNo,
								a.Status Status,
								a.Created_By CreatedBy,
								a.Created_On CreatedOn,
								a.Modified_By ModifiedBy,
								a.Modified_On ModifiedOn,
								a.Approval_Activity_Id ApprovalActivityId
							FROM
								Approval a
							WHERE
								a.Document_No = documentno;
								
								SELECT 
								a.Approval_Detail_Id ApprovalDetailId,
								a.Approval_Id ApprovalId,
								a.Document_Id DocumentId,
								a.Document_No DocumentNo,
								a.Level_Id LevelId,
								a.Primary_User_Id PrimaryUserId,
								a.Secondary_User_Id SecondaryUserId,
								a.Is_Viewed IsViewed,
								a.Status Status,
								a.Remarks1 Remarks1,
								a.Remarks2 Remarks2,
								a.Created_By CreatedBy,
								a.Created_On CreatedOn,
								a.Modified_By ModifiedBy,
								a.Modified_On ModifiedOn
							FROM
								Approval_Detail a
							WHERE
								a.Document_No = documentno
									AND a.Level_Id = levelid;
								
					SELECT 
					a.Approval_Detail_Id ApprovalDetailId,
					a.Approval_Id ApprovalId,
					a.Document_Id DocumentId,
					a.Document_No DocumentNo,
					a.Level_Id LevelId,
					a.Primary_User_Id PrimaryUserId,
					a.Secondary_User_Id SecondaryUserId,
					a.Is_Viewed IsViewed,
					a.Status Status,
					a.Remarks1 Remarks1,
					a.Remarks2 Remarks2,
					a.Created_By CreatedBy,
					a.Created_On CreatedOn,
					a.Modified_By ModifiedBy,
					a.Modified_On ModifiedOn
				FROM
					Approval_Detail a
				WHERE
					a.Document_No = documentno
				ORDER BY a.Created_On DESC
				LIMIT 1;
                
            END IF;
        ELSE
			UPDATE wp_approval_detail AS wpad
			INNER JOIN Users u 
				ON u.User_Id = approverid
			INNER JOIN Work_Permit wp 
				ON wp.Work_Permit_Code = documentno 
			INNER JOIN Approval WFH on WFH.Document_No = documentno
			INNER JOIN Approval_Detail WFD ON WFD.Approval_Id = WFH.Approval_Id
			LEFT join Approval_Configuration ac on ac.Document_Id=WFH.Document_Id and ac.Approval_Activity_Id=documentactivityid and ac.Plant_Id=plantid
			LEFT JOIN Approval_Configuration_Details DTS ON DTS.Approval_Configuration_Id=ac.Approval_Configuration_Id AND DTS.Level_Id=WFD.Level_Id
			SET wpad.Modified_On = NOW(),
				wpad.Modified_By = approverid,
                wpad.Status = 76
			WHERE wp.Work_Permit_Id = wpad.Work_Permit_Id
			  AND DTS.Level_Id = levelid
			  AND (wpad.Primary_User_Id or wpad.Secondary_User_Id = approverid)  and wpad.Level_Id = levelid;
              
            -- APPROVAL HEADER TABLE UPDATE                         
			UPDATE Approval WFH 
            INNER JOIN Approval_Detail WFD ON WFD.Approval_Id = WFH.Approval_Id
			LEFT join Approval_Configuration ac on ac.Document_Id=WFH.Document_Id and ac.Approval_Activity_Id=documentactivityid and ac.Plant_Id=plantid
			LEFT JOIN Approval_Configuration_Details DTS ON DTS.Approval_Configuration_Id=ac.Approval_Configuration_Id AND DTS.Level_Id=WFD.Level_Id
			SET 
			WFH.Status=76,
			WFH.MODIFIED_BY=approverid, 
			WFH.MODIFIED_ON=NOW()
            WHERE                     
			WFH.Document_No=documentno  AND WFH.Document_Id=documentid AND WFD.Level_Id=levelid;
			                  
							  
			-- OPERATION WISE UPDATION:                    
			CALL SP_APPROVAL_WORKFLOW_TRANSACTION(companyid,plantid,documentid,documentno,status,approverid,documentdetailid,userid);                 
					  
			-- APPROVAL DETAILS TABLE UPDATE                         
			UPDATE Approval_Detail WFD 
            INNER JOIN Approval WFH ON WFH.Approval_Id=WFD.Approval_Id  
			SET 
			WFD.Remarks1=remarks1,
			WFD.Status=status,                        
			WFD.MODIFIED_BY=approverid, 
			WFD.MODIFIED_ON=NOW(),
			WFD.Is_Viewed=isviewed
			WHERE WFH.Document_No=documentno AND WFH.Plant_Id=plantid and wfd.Document_Id=documentid AND WFD.Level_Id = levelid; 
        END IF;
    END IF;
END//
DELIMITER ;
