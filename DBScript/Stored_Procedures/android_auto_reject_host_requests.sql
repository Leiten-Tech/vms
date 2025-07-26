-- GRANT SYSTEM_VARIABLES_ADMIN ON *.* TO 'VMS'@'%';
-- FLUSH PRIVILEGES;

-- SET GLOBAL event_scheduler = ON;

DROP EVENT IF EXISTS android_auto_reject_host_requests;

DELIMITER //

CREATE EVENT android_auto_reject_host_requests
ON SCHEDULE EVERY 5 MINUTE
DO
BEGIN
  UPDATE visitor_entry
  SET status = 76
  WHERE status = 74 
    AND is_android_visitor = 1
    AND TIMESTAMPDIFF(MINUTE, Visitor_Entry_Date, NOW()) > 15;
END //

DELIMITER ;

