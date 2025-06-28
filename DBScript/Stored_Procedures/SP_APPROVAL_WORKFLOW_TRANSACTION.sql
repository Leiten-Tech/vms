DELIMITER //
DROP PROCEDURE IF EXISTS SP_APPROVAL_WORKFLOW_TRANSACTION;

CREATE PROCEDURE SP_APPROVAL_WORKFLOW_TRANSACTION (
    IN companyid BIGINT,
    IN plantid BIGINT,
    IN documentid INT,
    IN documentno VARCHAR(255),
    IN status INT,
    IN approverid BIGINT,
    IN documentdetailid BIGINT,
    IN userid BIGINT
)
BEGIN
    IF documentid = 15 THEN
        UPDATE Area SET Status = status, Modified_By = userid, Modified_On = NOW() WHERE Area_Code = documentno;
    END IF;
    
    IF documentid = 8 THEN
        UPDATE Visitor_Entry SET Status = status, Modified_By = userid, Modified_On = NOW() WHERE Visitor_Entry_Code = documentno;
    END IF;

	IF documentid = 41 THEN
        UPDATE Vendor_registration SET Status = status, Modified_By = userid, Modified_On = NOW() WHERE Vendor_Reg_Code = documentno;
    END IF;
    
	IF documentid = 42 THEN
        UPDATE Work_permit SET Status = status, Modified_By = userid, Modified_On = NOW() WHERE Work_Permit_Code = documentno;
    END IF;
    
    IF documentid = 34 THEN
        UPDATE Visitor_Entry SET Status = status, Modified_By = userid, Modified_On = NOW() WHERE Visitor_Entry_Code = documentno;
    END IF;
    
END//
DELIMITER ;
