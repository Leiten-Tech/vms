CREATE TABLE IF NOT EXISTS `android_notification_details`
(
    `notification_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `notification_type` VARCHAR(30) NOT NULL,
    `visitor_or_host_id` VARCHAR(255) NOT NULL,
	`mobile_no` VARCHAR(15) NOT NULL,
    `notification_message` TEXT NOT NULL,
    `visitor_address` TEXT NOT NULL,
    `Visitor_Entry_Date` TEXT NOT NULL,
    `imageurl` VARCHAR(255) NOT NULL ,
    `visitor_entry_code`VARCHAR(255) NOT NULL ,
    `notification_status` INT NOT NULL,
    PRIMARY KEY (`notification_id`)
) ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;




