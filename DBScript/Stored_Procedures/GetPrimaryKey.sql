
DELIMITER //
DROP PROCEDURE IF EXISTS GetPrimaryKey;

CREATE PROCEDURE GetPrimaryKey(
    IN documentid VARCHAR(30),
    IN series VARCHAR(30)
)
BEGIN
	DECLARE documentno VARCHAR(255);
    DECLARE ERRMSG VARCHAR(255);
    DECLARE FUNCTIONNAME VARCHAR(255);
    DECLARE SEVERITY INT DEFAULT 16;
    DECLARE STATE INT DEFAULT 1;
    DECLARE prefix_val VARCHAR(30);
    DECLARE suffix_val VARCHAR(20);
    DECLARE symbol_val VARCHAR(30);
    DECLARE seq_val INT;
    DECLARE sequencename VARCHAR(255);
    DECLARE i INT DEFAULT 1;
    DECLARE MaxCount INT DEFAULT 5;
    DECLARE CurrentMonth VARCHAR(50);

    -- Check if numbering schema exists
    IF ((SELECT COUNT(1) FROM Numbering_Schema WHERE document_id = documentid AND COALESCE(sequence_name, '') <> '') = 0) THEN
        SELECT Function_Name INTO FUNCTIONNAME FROM `function` WHERE Function_Id = documentid LIMIT 1;
        SET ERRMSG = CONCAT('Numbering Schema not configured for ', FUNCTIONNAME, '. Kindly configure Numbering Schema first.');
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = ERRMSG;
    END IF;

    -- Get numbering schema details
    SELECT 
        ns.sequence_name, 
        ns.Prefix, 
        ns.Suffix, 
        nsv.Suffix AS symbol
    INTO 
        sequencename, 
        prefix_val, 
        suffix_val, 
        symbol_val
    FROM Numbering_Schema ns
    LEFT JOIN Numbering_Schema_search_View nsv ON ns.document_id = nsv.Function_Id
    WHERE ns.document_id = documentid;

    -- Handle series 46 if needed
    IF series = '46' THEN
        SELECT w_sequence_name INTO sequencename FROM Numbering_Schema WHERE document_id = documentid;
    END IF;

    -- Atomic increment of sequence value
    SET @seq_name = sequencename;
    SET @sql = 'UPDATE sequences SET next_val = LAST_INSERT_ID(next_val + 1) WHERE sequence_name = ?';
    PREPARE stmt FROM @sql;
    EXECUTE stmt USING @seq_name;
    DEALLOCATE PREPARE stmt;

    -- Get the incremented sequence value
    SET seq_val = LAST_INSERT_ID();

    -- Generate leading zeros
    SET @SEQ = '';
    WHILE (i <= (MaxCount - LENGTH(seq_val))) DO
        SET @SEQ = CONCAT(@SEQ, '0');
        SET i = i + 1;
    END WHILE;

    -- Construct document number
    SET documentno = CONCAT(
        prefix_val, 
        symbol_val, 
        @SEQ, 
        CAST(seq_val AS CHAR)
    );

    -- Return generated document number
    SELECT documentno;
END //
DELIMITER ;
