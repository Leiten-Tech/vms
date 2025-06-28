DROP PROCEDURE IF EXISTS SPGenerateSequence;
DELIMITER //

CREATE PROCEDURE SPGenerateSequence (
    IN functionid INT
)
BEGIN
    DECLARE functionname VARCHAR(100);
    DECLARE sequenceM VARCHAR(255);
    DECLARE sequenceW VARCHAR(255);
    DECLARE startVal INT;
    DECLARE seqCount INT;

    SELECT UPPER(REPLACE(REPLACE(Function_Name, ' ', ''), '-', '')) INTO functionname
    FROM function
    WHERE Function_Id = functionid;

    SET startVal = 1;

    SELECT COUNT('x') INTO seqCount
    FROM information_schema.tables
    WHERE table_name = functionname;

    IF (seqCount = 0) THEN
        SET sequenceM = CONCAT('
            CREATE SEQUENCE ', functionname, 'Seq
            START WITH ', startVal, '
            INCREMENT BY 1
            NO MAXVALUE
            NO CACHE;

            CREATE SEQUENCE W_', functionname, 'Seq
            START WITH ', startVal, '
            INCREMENT BY 1
            NO MAXVALUE
            NO CACHE;
        ');

        -- Create the Sequence
        PREPARE stmt FROM @sequenceM;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;

    -- UPDATE NUMBERINGSCHEMA SET SEQUENCENAME = CONCAT(functionname, 'Seq'), W_SEQUENCENAME = CONCAT('W_', functionname, 'Seq') WHERE NUMBERSCHEMAID = (SELECT MAX(NUMBERSCHEMAID) FROM NUMBERINGSCHEMA);
END;
//
DELIMITER ;
