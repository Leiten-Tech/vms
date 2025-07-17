DELIMITER //

CREATE  PROCEDURE ANDROID_UPDATE_NOTIFICATION_STATUS (
    IN NotificationId INT
)
BEGIN
    UPDATE android_notification_details
    SET notification_status = 2
    WHERE notification_id = NotificationId;
END //

DELIMITER ;
