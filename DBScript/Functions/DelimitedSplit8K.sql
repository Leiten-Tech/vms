DELIMITER //
DROP PROCEDURE IF EXISTS DelimitedSplit8K;
CREATE PROCEDURE DelimitedSplit8K(
    IN inputString VARCHAR(255),
    IN delimiterChar CHAR(1)
)
BEGIN
    WITH RECURSIVE SplitStrings AS (
        SELECT 
            SUBSTRING_INDEX(inputString, delimiterChar, 1) AS value,
            SUBSTRING(inputString, LENGTH(SUBSTRING_INDEX(inputString, delimiterChar, 1)) + 2) AS remainingString
        UNION ALL
        SELECT 
            SUBSTRING_INDEX(remainingString, delimiterChar, 1) AS value,
            SUBSTRING(remainingString, LENGTH(SUBSTRING_INDEX(remainingString, delimiterChar, 1)) + 2)
        FROM SplitStrings
        WHERE remainingString != ''
    )
    SELECT value FROM SplitStrings;
END //

DELIMITER ;