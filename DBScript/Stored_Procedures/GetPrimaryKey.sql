
DELIMITER //
DROP PROCEDURE IF EXISTS GetPrimaryKey;

CREATE PROCEDURE GetPrimaryKey(
    IN documentid VARCHAR(30),
    IN series VARCHAR(30)
)
BEGIN
	DECLARE documentno varchar(255);
    DECLARE ERRMSG VARCHAR(255);
    DECLARE FUNCTIONNAME VARCHAR(255);
    DECLARE SEVERITY INT DEFAULT 16;
    DECLARE STATE INT DEFAULT 1;
    DECLARE prefix_val VARCHAR(30);
    
    DECLARE suffix_val VARCHAR(20);
    DECLARE symbol_val VARCHAR(30);
    DECLARE SEQ VARCHAR(255);
    DECLARE rowCount INT;
    DECLARE sequencename varchar(255);
    DECLARE i INT DEFAULT 1;
    DECLARE MaxCount INT DEFAULT 5;
    DECLARE CurrentMonth VARCHAR(50);
	DECLARE functionname1 VARCHAR(100);
    DECLARE colName VARCHAR(100);
    DECLARE tableName VARCHAR(100);
    
    SET @SEQ = "";
    SET @prefix_val = null;
        
    IF ((SELECT COUNT(1) FROM Numbering_Schema WHERE document_id = documentid AND COALESCE(sequence_name, '') <> '') = 0) THEN
        SELECT Function_Name INTO FUNCTIONNAME FROM `function` WHERE Function_Id = documentid LIMIT 1;
        SET ERRMSG = CONCAT('Numbering Schema not configured for ', FUNCTIONNAME, '. Kindly configure Numbering Schema first.');
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = ERRMSG;
    END IF;

    SELECT sequence_name INTO @sequencename FROM Numbering_Schema WHERE document_id = documentid;

    IF series = '46' THEN
        SELECT w_sequence_name INTO @sequencename FROM Numbering_Schema WHERE document_id = documentid;
    END IF;

--    SET @sequencQuery = CONCAT('
		
        SELECT UPPER(SUBSTRING(Function_Name,1,3)) INTO functionname1 FROM `function` WHERE Function_Id = documentid;
		SELECT Prefix INTO @prefix_val FROM Numbering_Schema WHERE document_id = documentid;
        SELECT Suffix INTO @suffix_val FROM Numbering_Schema WHERE document_id = documentid;
        SELECT Table_Name INTO @tableName FROM Numbering_Schema WHERE document_id = documentid;
		SELECT Suffix INTO @symbol_val FROM Numbering_Schema_search_View WHERE Function_Id = documentid;
		
		SELECT COLUMN_NAME into colName FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'ssmpl_live' AND TABLE_NAME = @tableName AND COLUMN_KEY = 'PRI';
        
		-- SELECT IFNULL(MAX(colName) + 1, 1) into @rowCount FROM @tableName;
		SET @sql = CONCAT('SELECT IFNULL(MAX(',colName,') + 1, 1) into @rowCount FROM ', @tableName);

		PREPARE stmt FROM @sql;
		EXECUTE stmt;
		DEALLOCATE PREPARE stmt;
		
        -- SELECT MAX(colName) + 1 into @rowCount from @tableName;
         
         WHILE (i <= (MaxCount - LENGTH(@rowCount))) DO
             SET @SEQ = CONCAT(@SEQ, "0");
             SET i = i + 1;
         END WHILE;
        IF (documentid = "87" OR documentid = "73" OR documentid = "101" OR documentid = "100") THEN
            IF (series = "45") THEN
                SET @prefix_val = CONCAT("M", @prefix_val);
            END IF;
        END IF;
        IF (series = "46") THEN
            SET @prefix_val = CONCAT("W", @prefix_val);
        END IF;
        SET documentno = CONCAT(@prefix_val, @symbol_val, @SEQ, CAST(@rowCount AS CHAR(255)));
        SELECT documentno;
--    ');
    
    -- PREPARE stmt FROM @sequencQuery;
    -- EXECUTE stmt;
    -- DEALLOCATE PREPARE stmt;
END //
DELIMITER ;
