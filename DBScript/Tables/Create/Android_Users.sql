CREATE TABLE IF NOT EXISTS `Android_Users` (
    `user_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_name` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `mobileno` VARCHAR(30) NOT NULL UNIQUE,
    `emailid` VARCHAR(100) NOT NULL UNIQUE,
    `company_name` VARCHAR(100) DEFAULT NULL,
    `status` INT NOT NULL,
    `user_image_url` VARCHAR(255) DEFAULT NULL,
    `user_image_name` VARCHAR(255) DEFAULT NULL,
    `created_on` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_on` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    `verified` TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (`user_id`),
    INDEX (`mobileno`),
    INDEX (`emailid`)
) 
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
