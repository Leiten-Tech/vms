DELIMITER //
DROP PROCEDURE generate_code_sp;
CREATE PROCEDURE generate_code_sp(INOUT new_code VARCHAR(10))
BEGIN
    DECLARE new_id INT;
    
    -- Get the last inserted ID
    SET new_id = LAST_INSERT_ID();
    -- Generate code
    SET new_code = CONCAT('VIS', LPAD(new_id, 4, '0'));
END//

DELIMITER ;
